import requests
from Cripto.dataacces import DBmanager
import sqlite3
from flask import jsonify, render_template, request, Response
from Cripto import app
from http import HTTPStatus
from datetime import datetime



dbManager = DBmanager (app.config.get ("DATABASE"))
Secretkey = app.config.get ("SECRET_KEY")


@app.route ("/api/v1/actualizar", methods = ['POST'])
def lista():
    acumulado = 0
    if request.method == 'POST':
        dd = request.json
        print(dd)
        for clave, valor in dd.items ():
            if clave != "EUR" and valor != 0:
                cl = clave
                vl = valor
                eur ="EUR"
                url = f"https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount={vl}&symbol={cl}&convert={eur}&CMC_PRO_API_KEY={Secretkey}"
                res = requests.get(url)
                res1 = res.json()
                acumulado += res1['data']['quote']['EUR']['price']
    print(acumulado)
    return jsonify ({'status': 'success', 'mensaje' : str(acumulado)})
        
        



@app.route ("/")
def listaMovimientos ():
    return render_template ("spa.html")

@app.route ("/api/v1/movimientos")
def movimientos ():
    query = "SELECT * FROM Movimiento ORDER BY date;"
   
    try:
       lista = dbManager.consultaMuchasSQL (query) 
       return jsonify ({'status': 'success', 'movimientos': lista})
    except sqlite3.Error as e:
        return jsonify({'status':'fail', 'mensaje': str(e)})

@app.route('/api/v1/movimiento/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@app.route('/api/v1/movimiento', methods=['POST'])
def detalleMovimiento(id=None):
    now = datetime.now()
   
    try:
        if request.method in ('GET', 'PUT', 'DELETE'):
            movimiento = dbManager.consultaUnaSQL("SELECT * FROM Movimiento WHERE id = ?", [id])
        
        if request.method == 'GET':
            if movimiento:
                return jsonify({
                    "status" : "success",
                    "movimiento" : movimiento
                })
            else:
                return jsonify({"status": "fail", "mensaje":"movimiento no encontrado"}), HTTPStatus.NOT_FOUND #para que aparezca el error 404 not found

        if request.method == 'PUT':
            dbManager.modificaTablaSQL("""
                UPDATE Movimiento 
                SET date=:date, moneda_from=:moneda_from, cantidad_from=:cantidad_from, moneda_to=:moneda_to, cantidad_to=:cantidad_to 
                WHERE id = {}""".format(id), request.json)
            
            return jsonify ({"status":"success", "mensaje": "registro modificado"})
        
        if request.method == 'DELETE':
            dbManager.modificaTablaSQL("""
                DELETE FROM Movimiento
                WHERE id = ?""", [id])

            return jsonify({"status": "success", "mensaje": "registro borrado"})

        if request.method == 'POST':
            datos = request.json
            datos["date"] = "{}-{}-{}".format(now.year, now.month, now.day)
            datos["time"] = "{}:{}:{}".format(now.hour, now.minute, now.second)
            dbManager.modificaTablaSQL("""
                INSERT INTO Movimiento
                       (date, time,  moneda_from, cantidad_from, moneda_to, cantidad_to)
                VALUES (:date, :time, :moneda_from, :cantidad_from, :moneda_to, :cantidad_to) 
                """, datos)
            return jsonify({"status": "success", "mensaje": "registro creado"}), HTTPStatus.CREATED


    except sqlite3.Error as e:
        return jsonify ({"status":"fail", "mensaje" : "Error en la base de datos: {}".format(e)}), HTTPStatus.BAD_REQUEST

@app.route('/api/v1/par/<_from>/<_to>/<quantity>')
@app.route('/api/v1/par/<_from>/<_to>')
def par(_from, _to, quantity = 1.0):
    url = f"https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount={quantity}&symbol={_from}&convert={_to}&CMC_PRO_API_KEY={Secretkey}"
    res = requests.get(url)
    print (res)
    return Response(res)




