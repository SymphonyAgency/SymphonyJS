#SymphonyJs

##Features
* Add new functions to SymphonyJs
* Run functions on window/jquery events
* Run functions only on certain breakpoints
* Run functions only if specific Dom Elements are found(pages)
* Accessible class utility methods and variables

##Add new functions to SymphonyJs

SymphonyJs is compiled using WebPack.  `src/index.js` is the entry point for the
application.  The constructing function `SymphonyJs()` requires the actual symphony
class from `src/symphonyFunctionsClass.js`, and then adds all `module.exports` from 
`.js` files found in `src/extensions/` as new prototypes of the class.  Having these
added as prototypes gives the extending functions access to the instance variables
and methods.

###Usage

1. Creates a new js file in `src/extensions`.
2. Write your function as a key/value pair, or as a named function.
3. `module.exports = ` your object or function.

**Option 1**:  Named function

The class generator will use the function's name as the prototype name
```javascript
//src/extensions/yourFile.js

module.exports = function myNewFunction(){
    //your code here
}
```
```javascript
//client code

const symphony = new SymphonyJs()
symphony.myNewFunction()
```

**Option 2**:  Object

The class generator will add all keys that are functions to the class prototypes.
```javascript
//src/extensions/yourFile.js

module.exports = {
    myNewFunction: function(){
        //your code here
    }
}

//Or a little cleaner, and with another function
module.exports = {
    myNewFunction(){
        //your code here
    },
    myNewFunction2(){
        //more code
    }
}

```
```javascript
//client code

const symphony = new SymphonyJs()
symphony.myNewFunction()
symphony.myNewFunction2()
```

##Run functions on jQuery events (ready, load, resize)
In order to enqueue actions to run on events your function will need to make use
of some of the class methods - at the very least: `this.addToQueues()`.  Every
action that can be enqueued or triggered must submit a common structure to 
`this.addToQueues()` as either an object, for a single event, or array of objects.

object template:
```javascript
let action = {
    func: yourFunction,
    options: {
        windowEvents: ['ready', 'resize', 'load'],
        breakpoints: ['xs', 'sm', 'md', 'lg'],
        onlyOnBreakpointChange: true
    }
}
```
* `func`: can be an anonymous function, or a reference to one.  This will be run by 
the queuing service
* `options`: The options object can contain triggers (found below), and custom values.
The entire object will be passed into `func` when the queuing service runs it, so feel
free to add custom stuff.  **Note:** class level variables can be passed into the initializing
options of SymphonyJs, as `this.options` will be available to custom extension functions.

* `windowEvents`: accepts *String* or *Array of Strings*.  Defaults to 'ready'.
* `breakpoints`: accepts *String* or *Array of Strings*. Defaults to all breakpoints.
* `onlyOnBreakpointChange`: *Boolean* only runs initially, and when breakpoint changes.


##Utility functions
SymphonyJs exposes several utility functions to be used in custom functions. 

`processArrayOrType`: Params('type', input, callback)
This function allows you to run a function once, or many times based on whether the
input is a single item, or an array of them.
*`type`: is the `typeof` of whatever parameter you're checking for.
*`input`: is the variable or array
*`callback`: is the function that will be run based on the number of inputs.

**Usage:**
```javascript
module.exports = function sayThings(things){
    this.processArrayOrType('string', things, (thing)=>{
        console.log(`Saying: ${thing}`)
    })
}
``` 
```javascript
SymphoniJs.sayThings('Hello!') //output: Saying: Hello!
SymphoniJs.sayTHings(['yes', 'maybe', 'no'])
/**  output:
* Saying: yes
* Saying: maybe
* Saying: no
*/
```


`domElementExists`: Params(string target || Array of string targets)
*`targets`: 1 jQuery search per parameter as a string.
* returns:  boolean
The purpose of the is to check if dependencies on the page exist before running a function.
This can be used in combination with custom action options to determine what pages the
action should be run on.

**usage**
```javascript
module.exports = function sayThings(things){
    if(this.domElementExists('body.sayThingPage')){
       
       this.processArrayOrType('string', things, (thing)=>{
            console.log(`Saying: ${thing}`)
        }) 
    }
}
```

##Using these functions in combination
Here is an example of creating a custom function extension of SymphonyJs

```javascript
//src/saythings.js

module.exports = function sayThings(optionsInput){

    //allow for multiple action queue registrations in a single call.
    this.processArrayOrType('object', optionsInput, (options)=>{

        //Only add to queue if dependencies exist as defined by custom options var dependencies
        if(this.domElementExists(optionsInput.dependencies)){

            //add to the queue
            this.addToQueues({
                func: function(options){

                    //allow for single or multi-input for options.things
                    this.processArrayOrType('string', options.things, (thing)=>{

                        console.log(`Saying: ${thing}`)
                    })
                },
                options: options
            })
        })
    }
}

```

```javascript
//client js

const symphony = SymphonyJs()

symphony.sayThings([{
    things: 'Hello', //defaults to on ready.  null/undefined dependenices will run.
},{
    things: ['its', 'meeee'],          //func determines that both are logged
    dependencies: '.its-me-page',      //only enqueued if .its-me-page exists
    windowEvents: ['ready', 'resize'], //runs on ready, and resize
    onlyOnBreakpointChange: true,      //but only if resize triggers a new breakpoint
    breakPoints: ['xs', 'md', 'lg']    //and only if that breakpoint is xs, md, or lg
}])


```

##extensions

###Custom()
The custom function is a useful utility to run custom JS on breakpoints.

```javascript
const symphony = SymphonyJs()

symphony.custom({
    windowEvents: ['ready', 'resize'], //runs on ready, and resize
    onlyOnBreakpointChange: true,      //but only if resize triggers a new breakpoint
    breakPoints: ['xs', 'md', 'lg']
    },
    function(){
        //Function to be run
    },
    function(){
        //Reset function to undo on off breakpoints.
    })

```