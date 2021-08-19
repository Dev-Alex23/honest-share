import React, { Component } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import Decentragram from "../abis/Decentragram.json";
import Navbar from "./Navbar";
import Main from "./Main";

//making a connecting to the IPFS
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  //taken from web3 library to check that the browser is able to conect to the blockchain
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Sorry But the browser that you are using is not blockchain enabled. consider using MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    //load accounts
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ account: accounts[0] });

    const NetworkId = await web3.eth.net.getId();
    const networkData = Decentragram.networks[NetworkId];
    if (networkData) {
      const decentragram = web3.eth.Contract(Decentragram.abi, networkData.address);
      this.setState({ decentragram: decentragram });
      const imagesCount = await decentragram.methods.imageCount().call();

      for (var i = 1; i <= imagesCount; i++) {
        const image = await decentragram.methods.images(i).call();
        this.setState({
          images: [...this.state.images, image],
        });
      }

      // Sort images highest amount first
      this.setState({
        images: this.state.images.sort((a, b) => b.tipAmount - a.tipAmount),
      });

      this.setState({ loading: false });
    } else {
      window.alert("Something Went Wrong!");
    }
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  uploadImage = (description) => {
    console.log("Submitting file to ipfs...");

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("Ipfs result", result);
      if (error) {
        console.error(error);
        return;
      }

      this.setState({ loading: true });
      this.state.decentragram.methods
        .uploadImage(result[0].hash, description)
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
        });
    });
  };

  tipImageOwner = (id, tipAmount) => {
    this.setState({ loading: true });
    this.state.decentragram.methods
      .tipImageOwner(id)
      .send({ from: this.state.account, value: tipAmount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      decentragram: null,
      images: [],
      loading: true,
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div id='loader' className='text-center mt-5'>
            <p>Loading...</p>
            <img alt='' src='src/components/cam.gif' />
          </div>
        ) : (
          <Main
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            images={this.state.images}
            tipImageOwner={this.tipImageOwner}
          />
        )}
      </div>
    );
  }
}

export default App;
