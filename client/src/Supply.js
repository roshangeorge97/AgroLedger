import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"
import { Web3Storage } from 'web3.storage'

// Construct with token and endpoint
const client = new Web3Storage({ token: API_TOKEN })

const fileInput = document.querySelector('input[type="file"]')

// Pack files into a CAR and send to web3.storage
const rootCid = await client.put(fileInput.files) // Promise<CIDString>

// Get info on the Filecoin deals that the CID is stored in
const info = await client.status(rootCid) // Promise<Status | undefined>

// Fetch and verify files from web3.storage
const res = await client.get(rootCid) // Promise<Web3Response | null>
const files = await res.files() // Promise<Web3File[]>

for (const file of files) {
  console.log(`${file.cid} ${file.name} ${file.size}`)
}


function Supply() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [MedStage, setMedStage] = useState();
    const [ID, setID] = useState();
    const [price,setPrice] = useState();

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    };
    const loadBlockchaindata = async () => {
        setloader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setCurrentaccount(account);
        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];
        if (networkData) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplychain);
            var i;
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = [];
            for (i = 0; i < medCtr; i++) {
                med[i] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            console.log(med)
            
            setMedStage(medStage);
            setloader(false);
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
    }
    if (loader) {
        return (
            <div>
                <h1 className="wait">Loading...</h1>
            </div>
        )

    }

    const loadPrice = async (event) => {
        event.preventDefault();
        var i;
        const medCtr = await SupplyChain.methods.medicineCtr().call();
        for (i = 0; i < medCtr; i++) {
    const price1 = await SupplyChain.methods.getPrice(i+1).call();
    setPrice(price1);
        }
    console.log("price: "+price)
    }



    const redirect_to_home = () => {
        history.push('/')
    }

    const handlerChangeID = (event) => {
        setID(event.target.value);
    }

    const handlerChangePrice = (event) =>{
        setPrice(event.target.value);
    }

    const handlerSubmitRMSsupply = async (event) => {
        event.preventDefault();
        try {
            console.log('called!!!!!!!!!!!')
          var reciept = await SupplyChain.methods.RMSsupply(ID).send({ from: currentaccount });
          var reciept2 = await SupplyChain.methods.setPrice(ID, price).send({ from: currentaccount });
          console.log(reciept);
          console.log(reciept2);
          loadPrice();
          if (reciept) {
            loadBlockchaindata();
          }

        } catch (err) {
          alert('An error occurred!!!');
        }
      };

    const handlerSubmitManufacturing = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Manufacturing(ID).send({ from: currentaccount });

          loadPrice();
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }

    

    const handlerSubmitDistribute = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.Distribute(ID).send({ from: currentaccount });
            var reciept2 = await SupplyChain.methods.setPrice(ID, price).send({ from: currentaccount });
          console.log(reciept);
          console.log(reciept2);
          loadPrice();
            if (reciept) {
                
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    const handlerSubmitRetail = async (event) => {
        event.preventDefault();
        try { var reciept = await SupplyChain.methods.Retail(ID).send({ from: currentaccount });
        var reciept2 = await SupplyChain.methods.setPrice(ID, price).send({ from: currentaccount });
      console.log(reciept);
      console.log(reciept2);
      loadPrice();
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    const handlerSubmitSold = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.sold(ID).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }
    return (
        <div>
            <span><b>Current Account Address:</b> {currentaccount}</span>
            <span onClick={redirect_to_home} className="btn btn-outline-danger btn-sm"> HOME</span>
            <h6><b>Supply Chain Flow:</b></h6>
            <p>Product Order -&gt; Raw Material Supplier -&gt; Manufacturer -&gt; Distributor -&gt; Retailer -&gt; Consumer</p>
            <table className="table table-sm table-dark">
                <thead>
                    <tr>
                        <th scope="col">Product ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Current Sold Price</th>
                        <th scope="col">Current Processing Stage</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(MED).map(function (key) {
                        return (
                            <tr key={key}>
                                <td>{MED[key].id}</td>
                                <td>{MED[key].name}</td>
                                <td>{MED[key].description}</td>
                                <td>
                                {MED[key].price}
                                </td>
                                <td>
                                    {
                                        MedStage[key]
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <h5><b>Step 1: Supply Raw Materials</b>(Only a registered Raw Material Supplier can perform this step):-</h5>
            <form onSubmit={handlerSubmitRMSsupply}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text"  onChange={handlerChangePrice} placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitRMSsupply}>Supply</button>
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitRMSsupply}>Upload Receipt</button>
            </form>
            <hr />
            <br />
            <h5><b>Step 2: Manufacture</b>(Only a registered Manufacturer can perform this step):-</h5>
            <form onSubmit={handlerSubmitManufacturing}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text"  placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitManufacturing}>Manufacture</button>
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitRMSsupply}>Upload Receipt</button>
            </form>
            <hr />
            <br />
            <h5><b>Step 3: Distribute</b>(Only a registered Distributor can perform this step):-</h5>
            <form onSubmit={handlerSubmitDistribute}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text"  placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitDistribute}>Distribute</button>
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitRMSsupply}>Upload Receipt</button>
            </form>
            <hr />
            <br />
            <h5><b>Step 4: Retail</b>(Only a registered Retailer can perform this step):-</h5>
            <form onSubmit={handlerSubmitRetail}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text"  placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitRetail}>Retail</button>
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitRMSsupply}>Upload Receipt</button>
            </form>
            <hr />
            <br />
            <h5><b>Step 5: Mark as sold</b>(Only a registered Retailer can perform this step):-</h5>
            <form onSubmit={handlerSubmitSold}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text"  placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitSold}>Sold</button>
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitRMSsupply}>Upload Receipt</button>
            </form>
            <hr />
        </div>
    )
}

export default Supply
