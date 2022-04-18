import React, { Component } from 'react';
import NITP from '../NITP.png';
import './App.css';


//For file upload using ipfs
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: "ipfs.infura.io", port:5001,  protocol: 'https'})


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account:"",
      buffer: null,
      contract: null,
      record: null,
      type:"aadhar",
      fileHash:"QmdE3yFxHLY4gN5U8HDRnpX3Nj4UMrBkrsdnGWsgjLEyJ4"
    };
  }


  //callback function for onChange event handler
  captureFile = (event) => {
    event.preventDefault()

    //Process file for IPFS

    //1.Capture file and read
    const file = event.target.files[0]
    const reader = new window.FileReader()

    //2.Convert file to buffer to upload/send to ipfs
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
      console.log('buffer', Buffer(reader.result))
    }
  }

  captureType = (event) => {
    event.preventDefault()
    const type = document.getElementById('type').value
    this.setState({type : type})
    console.log(type)
  }

  //callback function for onSubmit event handler
  onSubmit = (event) => {
    event.preventDefault()
    console.log('submiting file')

    //upload file to ipfs
    ipfs.add(this.state.buffer, (error, result) => {
    console.log('ipfs result', result)

      //getting hash of file from ipfs
      const fileHash = result[0].hash
      console.log(fileHash)
      if(error){
        console.error(error)
        return
      }

      //store hash on blockchain
      // this.state.contract.methods.setInfo(this.state.type, fileHash, 0).send({from: this.state.account}).then((r) => {
      //   this.setState({fileHash: fileHash})
      // })
    })

    
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            PISB
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={NITP} className="App-logo" alt="logo" />
                </a>
                <h1>National Institute Of Technology Patna</h1>
                <h4>
                 Personal Information Storage Using Etherium Blockchain
                </h4>

                <div className="content">
                  <h3>Add Your Files</h3>
                  <form action="" className='form' onSubmit={this.onSubmit}>
                    <input type="file" onChange={this.captureFile}/>
                    <select className='mr-5' name="type" id="type" onChange={this.captureType}>
                       <option value="aadhar">Aadhar Card</option>
                       <option value="drive">Driving License</option>
                       <option value="pan">Pan Card</option>
                       <option value="tenth">Tenth Certificate</option>
                       <option value="twelth">Twelth Certificate</option>
                    </select>
                    
                    <input type="submit" />
                  </form>
          
                  <div className="mt-4">
                    <a className='fileshow'  href={`https://ipfs.infura.io/ipfs/${this.state.fileHash}`}>Get file</a>
                  </div>

                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
