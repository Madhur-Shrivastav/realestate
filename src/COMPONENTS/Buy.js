import axios from "axios";
import "./Buy.css";
import { useState, useEffect } from "react";

function BuyComponent({ web3api }) {
  console.log(web3api);

  const [walletaccounts, setwalletaccounts] = useState([]);
  const [connectedaccount, setconnectedaccount] = useState(null);
  const [accountbalance, setaccountbalance] = useState(null);
  const [available, setavailable] = useState(false);

  useEffect(() => {
    const { provider, web3 } = web3api;
    async function getAccounts() {
      try {
        const walletaccounts = await provider.request({
          method: "eth_requestAccounts",
        });
        setwalletaccounts(walletaccounts);
        const connectedaccount = walletaccounts[0];
        setconnectedaccount(connectedaccount);

        provider.on("accountsChanged", (updatedAccounts) => {
          const newConnectedAccount = updatedAccounts[0];
          setconnectedaccount(newConnectedAccount);
        });

        const accountbalance = await web3.eth.getBalance(connectedaccount);
        setaccountbalance(web3.utils.fromWei(accountbalance, "ether"));
      } catch (error) {
        alert(error.message);
      }
    }
    provider && getAccounts();
  }, [web3api, connectedaccount]);

  const [purchasing, setpurchasing] = useState(false);
  async function buyproperty() {
    setpurchasing(true);
    const { contract } = web3api;
    const inputnumber = document.getElementById("number").value;

    const propertiesarray = await contract.methods.getNFTS().call();
    console.log(propertiesarray);
    console.log(propertiesarray[0].nftID);
    console.log(propertiesarray[0].nftPrice);
    console.log(inputnumber === propertiesarray[0].nftID);
    if (inputnumber === "") {
      alert("Please enter your property ID!");
      setpurchasing(false);
      return;
    }
    if (inputnumber === "0" || parseInt(inputnumber) < 0) {
      alert("Please enter a valid property ID!");
      setpurchasing(false);
      return;
    }
    if (propertiesarray.length === 0) {
      alert("No NFTS available");
      setpurchasing(false);
      return;
    }

    propertiesarray.forEach(async (nft) => {
      if (nft.nftID === inputnumber) {
        await contract.methods
          .buyNFT(nft.nftID)
          .send({ from: connectedaccount, value: nft.nftPrice, gas: 500000 })
          .then(() => {
            setpurchasing(false);
            window.location.reload();
          })
          .catch((error) => {
            if (error.message.includes("Manager cannot buy!")) {
              alert("Manager cannot buy!");
              console.log("Manager cannot buy!");
            } else if (error.message.includes("Token does not exist!")) {
              alert("Token does not exist!");
              console.log("Token does not exist!");
            } else if (
              error.message.includes("You are the owner of this NFT!")
            ) {
              alert("You are the owner of this NFT!");
              console.log("You are the owner of this NFT!");
            } else if (
              error.message.includes("This NFT has been sold already!")
            ) {
              alert("This NFT has been sold already!");
              console.log("This NFT has been sold already!");
            } else if (error.message.includes("Insufficient funds!")) {
              alert("Insufficient funds!");
              console.log("Insufficient funds!");
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
              console.log(error.message);
            }
            setpurchasing(false);
          });
      }
    });
  }

  useEffect(() => {
    const { contract } = web3api;
    async function getproperties() {
      await contract.methods.getNFTS().call((error, result) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(result);
        const PropertyCards = document.getElementById("property-cards");
        result.forEach(async (property) => {
          const CardBox = document.createElement("div");
          CardBox.className = "card-box";
          const Card = document.createElement("div");
          Card.id = "card";
          await axios.get(property.nftURI).then((response) => {
            console.log("The response is =>", response);
            console.log("The response data is =>", response.data);
            console.log("The name is =>", response.data.name);
            console.log("The contact is =>", response.data.contact);
            console.log("The location is =>", response.data.location);
            console.log("The size is =>", response.data.size);
            console.log("The price is =>", response.data.price);
            console.log("The image url is =>", response.data.url);
            console.log("The attributes are =>", response.data.attributes);
            for (var i = 1; i <= 3; i++) {
              if (i === 1) {
                const h4 = document.createElement("h4");
                h4.id = "id-div";
                h4.textContent =
                  "Property ID:" + parseInt(property.nftID).toString();
                Card.appendChild(h4);
              }
              if (i === 2) {
                const image = document.createElement("img");
                image.alt = "";
                image.src = response.data.url;
                Card.appendChild(image);
              }
              if (i === 3) {
                const div = document.createElement("div");
                div.id = "details";
                for (var j = 1; j <= 12; j++) {
                  if (j === 1) {
                    const h5 = document.createElement("h5");
                    h5.textContent = "Minter's name:" + response.data.name;
                    div.appendChild(h5);
                  }
                  if (j === 2) {
                    const h5 = document.createElement("h5");
                    h5.textContent =
                      "Minter's contact:" + response.data.contact;
                    div.appendChild(h5);
                  }
                  if (j === 3) {
                    const h5 = document.createElement("h5");
                    h5.textContent = "Location:" + response.data.location;
                    div.appendChild(h5);
                  }
                  if (j === 3) {
                    const h5 = document.createElement("h5");
                    h5.textContent = "Minted by:" + property.nftCreater;
                    div.appendChild(h5);
                  }
                  if (j === 4) {
                    const h5 = document.createElement("h5");
                    h5.textContent = "Owned by: " + property.nftOwner;
                    div.appendChild(h5);
                  }
                  if (j === 5) {
                    const h5 = document.createElement("h5");
                    h5.textContent =
                      "Production date:" + response.data.produced;
                    div.appendChild(h5);
                  }
                  if (j === 6) {
                    const h5 = document.createElement("h5");
                    h5.textContent = "Property Size:" + response.data.size;
                    div.appendChild(h5);
                  }
                  if (j === 7) {
                    const h5 = document.createElement("h5");
                    h5.textContent =
                      "Bedrooms:" + response.data.attributes.bedrooms;
                    div.appendChild(h5);
                  }
                  if (j === 8) {
                    const h5 = document.createElement("h5");
                    h5.textContent =
                      "Bathrooms:" + response.data.attributes.bathrooms;
                    div.appendChild(h5);
                  }
                  if (j === 9) {
                    const h5 = document.createElement("h5");
                    h5.textContent =
                      "Kitchens:" + response.data.attributes.kitchens;
                    div.appendChild(h5);
                  }
                  if (j === 10) {
                    const h5 = document.createElement("h5");
                    h5.textContent =
                      "Drawingrooms:" + response.data.attributes.drawingrooms;
                    div.appendChild(h5);
                  }
                  if (j === 11) {
                    const h5 = document.createElement("h5");
                    h5.textContent =
                      "Property Price:" +
                      (
                        parseFloat(response.data.price) / 1000000000000000000
                      ).toString() +
                      " ETH";
                    div.appendChild(h5);
                  }
                  if (j === 12) {
                    const h5 = document.createElement("h5");
                    const status = property.nftStatus;
                    if (status) {
                      h5.textContent = "Property Status: Sold";
                    } else {
                      h5.textContent = "Property Status: Available";
                    }
                    div.appendChild(h5);
                  }
                }
                Card.appendChild(div);
              }
            }
          });

          CardBox.appendChild(Card);
          PropertyCards.appendChild(CardBox);
          setavailable(true);
        });
      });
    }
    contract && getproperties();
  }, [web3api]);

  const searchfunction = async () => {
    const searchinput = document.getElementById("search");
    searchinput.addEventListener("input", (event) => {
      let inputtext = event.target.value.toLowerCase();
      console.log(inputtext);
      const propertycontainers =
        document.getElementById("property-cards").childNodes;
      console.log(propertycontainers);
      propertycontainers.forEach((propertycontainer) => {
        //console.log(propertycontainer);
        let cards = propertycontainer.childNodes;
        //console.log(cards);
        cards.forEach((card) => {
          //console.log(card);
          let cardchildren = card.childNodes;
          let detailsarray = cardchildren[2].childNodes;
          // console.log(detailsarray);
          detailsarray.forEach((details) => {
            const isthere =
              cardchildren[0].textContent
                .toLocaleLowerCase()
                .includes(inputtext) ||
              detailsarray[0].textContent.toLowerCase().includes(inputtext) ||
              detailsarray[1].textContent.toLowerCase().includes(inputtext) ||
              detailsarray[2].textContent.toLowerCase().includes(inputtext) ||
              detailsarray[3].textContent.toLowerCase().includes(inputtext) ||
              detailsarray[4].textContent.toLowerCase().includes(inputtext) ||
              detailsarray[5].textContent.toLowerCase().includes(inputtext) ||
              detailsarray[6].textContent.toLowerCase().includes(inputtext) ||
              detailsarray[7].textContent.toLowerCase().includes(inputtext) ||
              detailsarray[8].textContent.toLowerCase().includes(inputtext) ||
              detailsarray[9].textContent.toLowerCase().includes(inputtext);
            console.log(isthere);
            propertycontainer.classList.toggle("hide", !isthere);
          });
        });
      });
    });
  };
  return (
    <div id="parent">
      <div id="purchase-box">
        <div id="purchase-form">
          <h2>PURCHASE SECTION</h2>
          <div id="address-div">
            <h4>
              Connected Account:{" "}
              {connectedaccount ? connectedaccount : "not connected"}
            </h4>
            <h4>
              Connected Account Balance:{" "}
              {accountbalance ? accountbalance + " ETH" : "not connected"}
            </h4>
          </div>
          <div id="number-input">
            <input type="text" id="number" />
            <label htmlFor="">Property number:</label>
          </div>

          <div>
            {purchasing ? (
              <button id="purchasebtn">PURCHASING....</button>
            ) : (
              <button id="purchasebtn" onClick={buyproperty}>
                PURCHASE
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        {available ? (
          <div id="search-input">
            <input type="text" id="search" onKeyUp={searchfunction} />
            <label htmlFor="" id="search-label">
              Search your property by location, production date, price,
              bedrooms, bathrooms, kitchens, drawingrooms...
            </label>
          </div>
        ) : (
          <div id="search-input">
            <input type="text" id="search" onKeyUp={searchfunction} />
            <label htmlFor="">No properties available yet...</label>
          </div>
        )}
      </div>
      <div id="property-cards"></div>
    </div>
  );
}
export default BuyComponent;
