
import React, { Component } from 'react';

class Extra extends Component {
    constructor(){
        super();
        this.state = {
            c : 1 
        }
    }
    handleClick = () => {
        this.setState({ number: 2 }, () => {
           console.log('Anuranjan 1')
           console.log(this.state.number)
           console.log("Shrivastava 1")
        });
        this.setState({ number: 3 },() => {
            console.log('Anuranjan 2')
            console.log(this.state.number)
            console.log("Shrivastava 2")
         });
    }
  
    render() {
        
        return (
            <div style={{"color" : "white"}}
                 onClick={() => this.handleClick()}>
                Anuranjan 
            </div>
        );
    }
}

export default Extra;
