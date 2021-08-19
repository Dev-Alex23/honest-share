pragma solidity ^0.5.16;

// HonestSharing

contract Decentragram {

  string public name = "Decentragram";

  //store post using mapping
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  //Create Post 
  // remember that variable with underscore are used to deffrentiate between local variable from state ones
  function uploadImage(string memory _imghash, string memory _description) public {

    //Make sure user inputs does not equal to 0
    require(bytes(_description).length > 0);
    require(bytes(_imghash).length > 0);
    require(msg.sender != address(0x0));
    
    //increase imgage id /// change to id count
    imageCount++;

    //Adding images to the contact
    images[imageCount] = Image(imageCount, _imghash, _description, 0, msg.sender);

    emit ImageCreated(imageCount, _imghash, _description, 0, msg.sender);


  }

  //Tip Post
  function tipImageOwner(uint _id) public payable {
    //make sure the image id is valid
    require(_id > 0 && _id <= imageCount);

    //get image
    Image memory _image = images[_id];

    //get author
    address payable _author = _image.author;

    //Pay the author
    address(_author).transfer(msg.value);
    // address(_author).transfer(1 ether);


    //update the tipAmount
    _image.tipAmount = _image.tipAmount + msg.value;

    //update the image
    images[_id] = _image;

    //trigger an event
    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);

  }




}