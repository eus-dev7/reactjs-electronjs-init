# ElectronJS + ReactJS

Ejecucion modo desarrollador

```ssh
npm run electron-dev
```

Ejecucion modo desarrolador windows

```ssh
npm run start-dev
```

Ejecucion modo desarrolador MacOS Linux

```ssh
npm run start-mac
```

El comando para minificar y preparar el codigo para produccion build/

```ssh
npm run build
```

Para la obfuscacion de codigo se creo obfuscator.js que se ejecuta con el siguiente comando

```ssh
node obfuscator.js
```

Para generar instalador en produccion se debe desactivar isDev=false en app/main.js
electron genrate installer config build

```ssh
npm run dist:w
```

generate windows installer64

```ssh
npm run dist:w64
```

Para la generacion de instaladores para todos los entornos Windows, MacOS y Linux se genera con el siguiente comando

```ssh
npm run dist:l
```
