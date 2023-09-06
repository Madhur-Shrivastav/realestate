import "./Sell.css";
import axios from "axios";
import { useState, useEffect } from "react";

function SellComponent({ web3api }) {
  console.log(web3api);
  const [connectedaccount, setconnectedaccount] = useState("");
  const [walletaccounts, setwalletaccounts] = useState([]);

  useEffect(() => {
    const { provider } = web3api;
    async function getAccounts() {
      const walletaccounts = await provider.request({
        method: "eth_requestAccounts",
      });
      await provider.on("accountsChanged", async () => {
        try {
          const walletaccounts = await provider.request({
            method: "eth_requestAccounts",
          });
          setwalletaccounts(walletaccounts);
          const connectedaccount = walletaccounts[0];
          setconnectedaccount(connectedaccount);
        } catch (error) {
          alert(error.message);
        }
      });

      setwalletaccounts(walletaccounts);
      const connectedaccount = walletaccounts[0];
      setconnectedaccount(connectedaccount);
    }
    provider && getAccounts();
  }, [web3api, connectedaccount]);

  const [selling, setselling] = useState(false);

  async function sell() {
    setselling(true);
    const name = document.getElementById("name").value;
    const contact = document.getElementById("contact").value;
    const location = document.getElementById("location").value;
    const produced = document.getElementById("produced").value;
    const size = document.getElementById("size").value;
    const bedrooms = document.getElementById("bedrooms").value;
    const bathrooms = document.getElementById("bathrooms").value;
    const kitchens = document.getElementById("kitchens").value;
    const drawingrooms = document.getElementById("drawingrooms").value;
    const price = document.getElementById("price").value;
    const file = document.getElementById("file");

    if (
      name === "" ||
      contact === "" ||
      location === "" ||
      produced === "" ||
      size === "" ||
      bedrooms === "" ||
      bathrooms === "" ||
      kitchens === "" ||
      drawingrooms === "" ||
      price === "" ||
      file.files.length === 0
    ) {
      alert("All fields are required");
      setselling(false);
      return;
    }
    if (file.files.length === 0) {
      alert("Please select a file");
      setselling(false);
      return;
    }
    if (file.files.length > 1) {
      alert("Please select only one file");
      setselling(false);
      return;
    }
    if (name === "") {
      alert("Owner name is required");
      setselling(false);
      return;
    }
    if (contact === "") {
      alert("Owner contact is required");
      setselling(false);
      return;
    }
    if (location === "") {
      alert("Property location is required");
      setselling(false);
      return;
    }
    if (produced === "") {
      alert("Production date is required");
      setselling(false);
      return;
    }
    if (size === "") {
      alert("Property size is required");
      setselling(false);
      return;
    }
    if (price === "") {
      alert("Property price is required");
      setselling(false);
      return;
    }
    if (bedrooms === "") {
      alert("Number of bedrooms is required");
      setselling(false);
      return;
    }
    if (bathrooms === "") {
      alert("Number of bathrooms is required");
      setselling(false);
      return;
    }
    if (kitchens === "") {
      alert("Number of kitchens is required");
      setselling(false);
      return;
    }
    if (drawingrooms === "") {
      alert("Number of drawingrooms is required");
      setselling(false);
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append("file", file.files[0]);
      console.log("The retrieved file is=>", file.files[0]);
      const responsefile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formdata,
        headers: {
          pinata_api_key: "768547b882165c9c9ce9",
          pinata_secret_api_key:
            "6d560165885ab5404328ca5872f3293457de18233ca74cde090d2092e33a4348",
          "Content-Type": "multipart/form-data",
        },
      });
      const hash = responsefile.data.IpfsHash;
      console.log("Hash of the image uploaded is=>", hash);
      const url = `https://aqua-corresponding-tarantula-513.mypinata.cloud/ipfs/${hash}?gl=1*1f617u5*rs_ga*MTYzNDk4Nzk5Ny4xNjg1Mzk5MTU1*rs_ga_5RMPXG14TE*MTY4NTQ0NTY5Ni40LjEuMTY4NTQ0NTcwNi41MC4wLjA.`;
      console.log("Url of the image uploaded is=>", url);

      const metadata = {
        name: name,
        contact: contact,
        location: location,
        produced: produced,
        size: size,
        price: (parseFloat(price) * 1000000000000000000).toString(),
        url: url,
        attributes: {
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          kitchens: kitchens,
          drawingrooms: drawingrooms,
        },
      }; //Putting the details entered by the user into a variable called metadata.
      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: metadata,
        headers: {
          pinata_api_key: "768547b882165c9c9ce9",
          pinata_secret_api_key:
            "6d560165885ab5404328ca5872f3293457de18233ca74cde090d2092e33a4348",
          "Content-Type": "application/json",
        },
      }); //Uploading the metadata to ipfs using axios in the form of a json object.
      // console.log(response.data);
      const hashofmetadata = response.data.IpfsHash;
      console.log("Hash of the metadata is=> ", hashofmetadata);
      const urlofmetadata = `https://aqua-corresponding-tarantula-513.mypinata.cloud/ipfs/${hashofmetadata}?_gl=1*1f617u5*rs_ga*MTYzNDk4Nzk5Ny4xNjg1Mzk5MTU1*rs_ga_5RMPXG14TE*MTY4NTQ0NTY5Ni40LjEuMTY4NTQ0NTcwNi41MC4wLjA.`;
      console.log("URL of the metadata is=> ", urlofmetadata); //Getting URL of the metadata.
      await axios.get(urlofmetadata).then(async (response) => {
        //Using the url of the metadata to get the metadata as a  response by using the axios.get(url) method of axios.
        console.log("The response is =>", response);
        console.log("The response data is =>", response.data);
        console.log("The name is =>", response.data.name);
        console.log("The contact is =>", response.data.contact);
        console.log("The location is =>", response.data.location);
        console.log("The size is =>", response.data.size);
        console.log("The price is =>", response.data.price);
        console.log("The image url is =>", response.data.url);
        console.log("The attributes are =>", response.data.attributes);
        await web3api.contract.methods
          .sellNFT(urlofmetadata, metadata.price)
          .send({ from: connectedaccount, gas: 5000000 }); //Now calling the uploadCard function of the contract to upload the card by passing the card details fetched from the metadata url above.
        window.location.reload();
      });
    } catch (error) {
      if (error.message.includes("Manager cannot sell!")) {
        alert("Manager cannot sell!");
        console.log("Manager cannot sell!");
      } else if (
        error.message.includes(
          "VM Exception while processing transaction: revert Pausable: paused"
        )
      ) {
        alert(
          "The NFT market has been paused, please wait for it to be resumed!"
        );
        console.log(
          "The NFT market has been paused, please wait for it to be resumed!"
        );
      } else if (
        error.message.includes(
          "MetaMask Tx Signature: User denied transaction signature."
        )
      ) {
        alert("User rejected to sign the transaction!");
        console.log("User rejected to sign the transaction!");
      } else {
        alert(error.message);
      }
      setselling(false);
    }
    //const url = `ipfs://${responsefile.data.IpfsHash}`;
    //const url = `http://127.0.0.1:8080/ipfs/${hash}/`;
  }

  return (
    <div id="parent">
      <div id="seller-box">
        <div id="seller-form">
          <h2>SELLER SECTION</h2>
          <div id="address-div">
            <h4>
              Connected Account:{" "}
              {connectedaccount ? connectedaccount : "not connected!"}
            </h4>
          </div>
          <div id="name-input">
            <input type="text" id="name" />
            <label htmlFor="">Your name:</label>
          </div>
          <div id="contact-input">
            <input type="text" id="contact" />
            <label htmlFor="">Your email or phone number:</label>
          </div>
          <div id="location-input">
            <input type="text" id="location" />
            <label htmlFor="">Enter location:</label>
          </div>
          <div id="produced-input">
            <input type="text" id="produced" />
            <label htmlFor="">Date of production:</label>
          </div>
          <div id="size-input">
            <input type="text" id="size" />
            <label htmlFor="">Area of your property:</label>
          </div>
          <div id="bedrooms-input">
            <input type="text" id="bedrooms" />
            <label htmlFor="">Number of bedrooms:</label>
          </div>
          <div id="bathrooms-input">
            <input type="text" id="bathrooms" />
            <label htmlFor="">Number of bathrooms:</label>
          </div>
          <div id="kitchens-input">
            <input type="text" id="kitchens" />
            <label htmlFor="">Number of kitchens:</label>
          </div>
          <div id="drawingrooms-input">
            <input type="text" id="drawingrooms" />
            <label htmlFor="">Number of drawingrooms:</label>
          </div>
          <div id="price-input">
            <input type="text" id="price" />
            <label htmlFor="">Price of your property:</label>
          </div>
          <div id="file-input">
            <input type="file" id="file" />
            <label htmlFor="">Image of your property:</label>
          </div>
          <div>
            {selling ? (
              <button id="salebtn">PUTTING ON SALE....</button>
            ) : (
              <button id="salebtn" onClick={sell}>
                PUT ON SALE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellComponent;
