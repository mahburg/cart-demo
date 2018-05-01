exports = module.exports = {}
function consolidate(arr, consolidate_prop, props){
    try{
      if (typeof consolidate_prop === 'string' && Array.isArray(arr) && typeof arr[0] === 'object'){
        let sub = []
        let baseline = Object.assign({}, arr[0]);
        if (props){
          //pros start
          if (Array.isArray(props) || typeof props === 'string'){
            if (typeof props === 'string'){
              props = props.split(',').map(c=>c.trim())
            }
            for (let prop in baseline){
              if (!props.includes(prop)){
                delete baseline[prop];
              }
            }
            baseline[consolidate_prop] = []
            for (let i = 0 ; i < arr.length; i++){
              let temp = {}
              for (let key in arr[i]){
                if (!props.includes(key)){
                  temp[key] = arr[i][key]
                }
              }
              baseline[consolidate_prop].push(temp)
            }
          } else {
            throw new TypeError('The third argument of consolidate must be an array or a string.')
          }
          //props end
        } else {
          for (let i = 1; i < arr.length; i++){
            for (let prop in baseline){
              if (typeof baseline[prop] !== 'object' ){
                if (baseline[prop] !== arr[i][prop] ){
                  sub.push(prop)
                  delete baseline[prop]
                }
              } else {
                  sub.push(prop)
                  delete baseline[prop]
              }
            }
          }
          baseline[consolidate_prop] = []
          for (let i = 0 ; i < arr.length; i++){
            let temp = {}
            for (let prop of sub){
              temp[prop] = arr[i][prop]
            }
            baseline[consolidate_prop].push(temp)
          }
        }
        return baseline
      } else {
        // throw 'Invalid arguments'
        if(Array.isArray(arr)){
          throw new TypeError('The second argument of consolidate must be an string', 'consolidate.js', 3)
        } else {
          throw new TypeError('The first argument of consolidate must be an array')
        }
      }
    } catch (err){
      console.log(err.message)
      err.fileName && console.log(err.fileName)
      err.lineNumber && console.log(err.lineNumber)
    }
  }

exports.consolidate = consolidate;