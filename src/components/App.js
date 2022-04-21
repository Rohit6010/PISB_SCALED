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
      const record = await contract.methods.getInfo(49).call()
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
      record: { 0: 'null', 1: 'null', 2: 'null', 3: 'null', 4: 'null' },
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
      this.state.contract.methods.setInfo(this.state.type, fileHash, 49).send({ from: this.state.account }).then((r) => {
        this.setState({ fileHash: fileHash })
      })
    })


  }

  showFile = (event) => {
    var f1 = document.getElementById('f1')
    if (this.state.record[0] !== 'null') f1.style.display = 'inline';

    var f2 = document.getElementById('f2')
    if (this.state.record[1] !== 'null') f2.style.display = 'inline';

    var f3 = document.getElementById('f3')
    if (this.state.record[2] !== 'null') f3.style.display = 'inline';

    var f4 = document.getElementById('f4')
    if (this.state.record[3] !== 'null') f4.style.display = 'inline';

    var f5 = document.getElementById('f5')
    if (this.state.record[4] !== 'null') f5.style.display = 'inline';
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-light  back flex-md-nowrap py-3 px-1 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://github.com/Rohit6010/PISB_SCALED"
            target="_blank"
            rel="noopener noreferrer"
          >
           <strong>PISB</strong>
          </a>

          {/* display the account connected with metamask */}
          <ul className='navbar-nav px-3'>
            <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
              <small className='text-white'>{this.state.account}</small>
            </li>
          </ul>
        </nav>

        <div className="logo">
          <center>
            <img src={NITP} alt="NITPLogo" />
          </center>
        </div>

        <div className="container-fluid mt-3">
          <div className="row">
            <main role="main" className="col-lg-12  text-center">
              <div className="content mr-auto ml-auto logo">
                <svg xmlns="http://www.w3.org/2000/svg" height="90" width="135" preserveAspectRatio="xMidYMid" viewBox="-38.39985 -104.22675 332.7987 625.3605"><path fill="#343434" d="M125.166 285.168l2.795 2.79 127.962-75.638L127.961 0l-2.795 9.5z"/><path fill="#8C8C8C" d="M127.962 287.959V0L0 212.32z"/><path fill="#3C3C3B" d="M126.386 412.306l1.575 4.6L256 236.587l-128.038 75.6-1.575 1.92z"/><path fill="#8C8C8C" d="M0 236.585l127.962 180.32v-104.72z"/><path fill="#141414" d="M127.961 154.159v133.799l127.96-75.637z"/><path fill="#393939" d="M127.96 154.159L0 212.32l127.96 75.637z"/></svg>
                <h3 className='topic'>Personal Information Storage Using Ethereum Blockchain</h3>
                <div className="content1 margin back">
                  <div className="row">
                    <div className="col-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" style={{color:'gray'}} class="bi bi-file-earmark-plus-fill" viewBox="0 0 16 16">
                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM8.5 7v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </div>

                    <div className="col-6 topic">
                      <h4>Add Files Here</h4>
                    </div>

                    <div className="col-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style={{color:'gray'}} fill="currentColor" class="bi bi-file-earmark-plus-fill" viewBox="0 0 16 16">
                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM8.5 7v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 1 0z" />
                      </svg>
                    </div>
                  </div>
                  <hr className='rule'/>
                  <form action="" className='form' onSubmit={this.onSubmit}>
                    <input style={{ paddingTop: "3px", paddingBottom: "3px" }} type="file" onChange={this.captureFile} />
                    <select style={{ paddingTop: "3px", paddingBottom: "3px" }} className='mr-5' name="type" id="type" onChange={this.captureType}>
                      <option value="aadhar">Aadhar Card</option>
                      <option value="drive">Driving License</option>
                      <option value="pan">Pan Card</option>
                      <option value="tenth">Tenth Certificate</option>
                      <option value="twelth">Twelth Certificate</option>
                    </select>

                    <input className='btn btn-success btn-md' type="submit" />
                  </form>

                  {/* Files  */}
                  <div className="mt-4 file">
                    <a id='f1' className='fileshow mx-1 btn btn-info' href={`https://ipfs.infura.io/ipfs/${this.state.record[0]}`}>Aadhar Card</a>
                    <a id='f2' className='fileshow mx-1 btn btn-info' href={`https://ipfs.infura.io/ipfs/${this.state.record[1]}`}>Driving License</a>
                    <a id='f3' className='fileshow mx-1 btn btn-info' href={`https://ipfs.infura.io/ipfs/${this.state.record[2]}`}>Pan Card</a>
                    <a id='f4' className='fileshow mx-1 btn btn-info' href={`https://ipfs.infura.io/ipfs/${this.state.record[3]}`}>Tenth</a>
                    <a id='f5' className='fileshow mx-1 btn btn-info' href={`https://ipfs.infura.io/ipfs/${this.state.record[4]}`}>Twelth</a>
                  </div>

                  <div className='mt-2'>
                    <button className='btn btn-info btn-md' onClick={this.showFile}>Show File</button>
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
