import React, { Component } from 'react';
import NITP from '../NITP.png';
import './App.css';
import Web3 from 'web3';
import file from '../abis/File.json'

//For file upload using ipfs
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: "ipfs.infura.io", port: 5001, protocol: 'https' })


class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }


  //get account
  //get network
  //get smart contract
  //----> ABI: file.abi
  //----> Address: networkData.address
  //get file hash
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    //get network id
    const networkId = await web3.eth.net.getId()

    const networkData = file.networks[networkId]
    if (networkData) {
      const abi = file.abi
      const address = networkData.address
      //Fetch contract
      const contract = web3.eth.Contract(abi, address)
      this.setState({ contract: contract })

      //call getInfo method of contract
      const record = await contract.methods.getInfo(0).call()
      console.log(record)
      this.setState({ record: record })
    }
    else {
      window.alert('Smart contract not deployed to detected network !')
    }
  }


  constructor(props) {
    super(props);
    this.state = {
      account: "",
      buffer: null,
      contract: null,
      record: {},
      type: "aadhar",
      fileHash: "QmdE3yFxHLY4gN5U8HDRnpX3Nj4UMrBkrsdnGWsgjLEyJ4"
    };
  }


  //Connection to blockchain
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert("Please use metamask !")
    }
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
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', Buffer(reader.result))
    }
  }

  captureType = (event) => {
    event.preventDefault()
    const type = document.getElementById('type').value
    this.setState({ type: type })
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
      if (error) {
        console.error(error)
        return
      }

      // store hash on blockchain
      this.state.contract.methods.setInfo(this.state.type, fileHash, 0).send({ from: this.state.account }).then((r) => {
        this.setState({ fileHash: fileHash })
      })
    })


  }

  showFile = (event) => {
     var f1 = document.getElementById('f1')
     if(this.state.record[0]!=='null')f1.style.display = 'block';

     var f2 = document.getElementById('f2')
     if(this.state.record[1]!=='null')f2.style.display = 'block';

     var f3 = document.getElementById('f3')
     if(this.state.record[2]!=='null')f3.style.display = 'block';

     var f4 = document.getElementById('f4')
     if(this.state.record[3]!=='null')f4.style.display = 'block';

     var f5 = document.getElementById('f5')
     if(this.state.record[4]!=='null')f5.style.display = 'block';
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

          {/* display the account connected with metamask */}
          <ul className='navbar-nav px-3'>
            <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
              <small className='text-white'>{this.state.account}</small>
            </li>
          </ul>

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
                    <input type="file" onChange={this.captureFile} />
                    <select className='mr-5' name="type" id="type" onChange={this.captureType}>
                      <option value="aadhar">Aadhar Card</option>
                      <option value="drive">Driving License</option>
                      <option value="pan">Pan Card</option>
                      <option value="tenth">Tenth Certificate</option>
                      <option value="twelth">Twelth Certificate</option>
                    </select>

                    <input type="submit" />
                  </form>

                  {/* Files  */}
                  <div className="mt-4">
                    <a id='f1' className='fileshow mx-1' href={`https://ipfs.infura.io/ipfs/${this.state.record[0]}`}>Show file</a>
                    <a id='f2' className='fileshow mx-1' href={`https://ipfs.infura.io/ipfs/${this.state.record[1]}`}>Show file</a>
                    <a id='f3' className='fileshow mx-1' href={`https://ipfs.infura.io/ipfs/${this.state.record[2]}`}>Show file</a>
                    <a id='f4' className='fileshow mx-1' href={`https://ipfs.infura.io/ipfs/${this.state.record[3]}`}>Show file</a>
                    <a id='f5' className='fileshow mx-1' href={`https://ipfs.infura.io/ipfs/${this.state.record[4]}`}>Show file</a>
                  </div>

                  <div className='mt-2'>
                    <button onClick={this.showFile}>Show File</button>
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
