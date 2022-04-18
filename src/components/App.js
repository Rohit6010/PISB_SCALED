import React, { Component } from 'react';
import NITP from '../NITP.png';
import './App.css';

class App extends Component {
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
                  {/* <a className='fileshow'  href={`https://ipfs.infura.io/ipfs/${this.state.fileHash}`}>Get file</a> */}
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
