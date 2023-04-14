import React from 'react';


const Header = () => {

  return (
    <div className="Header">
      <div className="HeaderTop">
        <i>logo</i>
        <h3>EtherScrow</h3>  
        <h3>Home</h3>
        <h3>Existing Escrows</h3>
        <h3>Verify Contracts</h3>
      </div>

      <div className="HeaderTop">
      <form>
          <div>
            <input type="" placeholder="Search by Address of Beneficiary"/>
            <button>Search</button>
          </div>
      </form>
      </div>

    </div>
  );
};

export default Header;