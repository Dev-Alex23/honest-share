import React, { Component } from "react";
import Identicon from "identicon.js";
import "./App.css";

class Navbar extends Component {
  render() {
    return (
      //navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'
      <nav className='nav'>
        <a
          className='navbar-brand col-sm-3 col-md-2 mr-0'
          href='/'
          target='_blank'
          rel='noopener noreferrer'
        >
          HONESTSHARING
        </a>
        <ul className='navbar-nav px-3'>
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
            <small className='text-secondary'>
              <small id='account'>{this.props.account}</small>
            </small>
            {this.props.account ? (
              <img
                alt=''
                className='ml-2'
                width='30'
                height='30'
                src={`data:image/png;base64, ${new Identicon(
                  this.props.account,
                  30
                ).toString()}`}
              />
            ) : (
              <span></span>
            )}
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
