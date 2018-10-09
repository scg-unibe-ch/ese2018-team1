#Front end

##Structure
this website is structured with two different types of modules.
- one type is the type that gets displayed. this one you have to add in the app-routing.module.ts file
- the other type can be used to help display the first type or to hold data for the first type
be aware that for the first type to work, you need to remove its component from app.module.ts in the import and in the declarations. As well as add it to the app-routing.module.ts file (instuctions there)

to be able to instanciate a module you need a <componentName>.ts file in /app where you specify the properties of this module

the stylesheets for all the displayable modules are in assets/css folder and the javascripts in assets/js. Please refer for new stylesheets or javascripts in the src/index.html file, as there is the html head. 
