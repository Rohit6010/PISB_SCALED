pragma solidity 0.5.0;

contract File{
  struct Info{
    string aadhar;
    string drive;
    string pan;
    string tenth;
    string twelth;
  }

    Info[10] inf;
    constructor() public{
       for(uint i = 0; i<10; i++){
       inf[i] = Info("null", "null", "null", "null", "null");
    }

    }



    function setInfo(string memory _type, string memory _hash, uint _ind) public {
      if(keccak256(bytes(_type)) == keccak256(bytes("aadhar")))inf[_ind].aadhar = _hash;
      else if(keccak256(bytes(_type)) == keccak256(bytes("drive")))inf[_ind].drive = _hash;
      else if(keccak256(bytes(_type)) == keccak256(bytes("pan")))inf[_ind].pan = _hash;
      else if(keccak256(bytes(_type)) == keccak256(bytes("tenth")))inf[_ind].tenth = _hash;
      else inf[_ind].twelth = _hash;
    }

    function getInfo(uint _ind) public view returns(string memory, string memory, string memory, string memory, string memory){
      return (inf[_ind].aadhar, inf[_ind].drive, inf[_ind].pan, inf[_ind].tenth, inf[_ind].twelth);
    }

}