
Instalación
Instalar dependencias
pip install -r requirements.txt
Crear variables de entorno

Duplicar el fichero .env_template
Renombrar la copia a .env
Informar FLASK_ENV a elegir entre development y production
Crear fichero de configuracion

Duplicar el fichero config_templape.py
Renombrar la copia a config.py
Informar SECRET_KEY. Un buen sitio para crear claves aqui
Informar el fichero de bases de datos. La ruta debe estar dentro del proyecto
Crear base de datos ejecutando el fichero migrations/initial.sql

puedes hacerlo con un cliente gráfico o con sqlite3
Ejecutar lo siguiente
sqlite3 <ruta al fichero puesto en config.py>
.read <ruta relativa a migrations/initial.sql>
.tables 
.q
Ejecutar en local
Simplemente escribir

flask run