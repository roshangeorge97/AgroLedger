import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"



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
    const [price1,setPrice1] = useState();
    const [price2,setPrice2] = useState();
    const [price3,setPrice3] = useState();
    const [price4,setPrice4] = useState();
    const [price5,setPrice5] = useState();
    const [NF,setNF] = useState();
    const [SF,setSF] = useState();
    const [OF,setOF] = useState();
    const [PH,setPH] = useState();
    const [WQ,setWQ] = useState();
    const [TEMP,setTEMP] = useState();
    const [HUM,setHUM] = useState();




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

    const loadPrice1 = async (event) => {
        event.preventDefault();
        var i;
        const medCtr = await SupplyChain.methods.medicineCtr().call();
        for (i = 0; i < medCtr; i++) {
    const price1 = await SupplyChain.methods.getPrice1(i+1).call();
    setPrice1(price1);
        }
    console.log("price: "+price1)
    }
    
    const loadPrice2 = async (event) => {
        event.preventDefault();
        var i;
        const medCtr = await SupplyChain.methods.medicineCtr().call();
        for (i = 0; i < medCtr; i++) {
    const price2 = await SupplyChain.methods.getPrice2(i+1).call();
    setPrice2(price2);
        }
    console.log("price: "+price2)
    }
        const loadPrice3 = async (event) => {
        event.preventDefault();
        var i;
        const medCtr = await SupplyChain.methods.medicineCtr().call();
        for (i = 0; i < medCtr; i++) {
    const price3 = await SupplyChain.methods.getPrice3(i+1).call();
    setPrice3(price3);
        }
    console.log("price: "+price3)
    }
        const loadPrice4 = async (event) => {
        event.preventDefault();
        var i;
        const medCtr = await SupplyChain.methods.medicineCtr().call();
        for (i = 0; i < medCtr; i++) {
    const price4 = await SupplyChain.methods.getPrice4(i+1).call();
    setPrice4(price4);
        }
    console.log("price: "+price4)
    }



    const redirect_to_home = () => {
        history.push('/')
    }

    const handlerChangeID = (event) => {
        setID(event.target.value);
    }

    const handlerChangeNF = (event) => {
        setNF(event.target.value);
    }
    const handlerChangeSF = (event) => {
        setSF(event.target.value);
    }
    const handlerChangeOF = (event) => {
        setOF(event.target.value);
    }
    const handlerChangePH = (event) => {
        setPH(event.target.value);
    }
    const handlerChangeWQ = (event) => {
        setWQ(event.target.value);
    }
    const handlerChangeTEMP = (event) => {
        setTEMP(event.target.value);
    }
    const handlerChangeHUM = (event) => {
        setHUM(event.target.value);
    }
    

    const handlerChangePrice1 = (event) =>{
        setPrice1(event.target.value);
    }
    const handlerChangePrice2 = (event) =>{
        setPrice2(event.target.value);
    }
    const handlerChangePrice3 = (event) =>{
        setPrice3(event.target.value);
    }
    const handlerChangePrice4 = (event) =>{
        setPrice4(event.target.value);
    }
    const handlerChangePrice5 = (event) =>{
        setPrice5(event.target.value);
    }

    const handlerSubmitRMSsupply = async (event) => {
        event.preventDefault();
        try {
            console.log('ID:', ID);
console.log('NF:', NF);
console.log('SF:', SF);
console.log('OF:', OF);
            console.log('called!!!!!!!!!!!')
          var reciept = await SupplyChain.methods.RMSsupply(ID,NF,SF,OF).send({ from: currentaccount });
          var reciept2 = await SupplyChain.methods.setPrice1(ID, price1).send({ from: currentaccount });
          console.log(reciept);
          console.log(reciept2);
          loadPrice1();
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
            var reciept = await SupplyChain.methods.Manufacturing(ID,PH,WQ).send({ from: currentaccount });
            var reciept2 = await SupplyChain.methods.setPrice2(ID, price2).send({ from: currentaccount });
          console.log(reciept);
          console.log(reciept2);
          loadPrice2();
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
            var reciept = await SupplyChain.methods.Distribute(ID,TEMP,HUM).send({ from: currentaccount });
            var reciept2 = await SupplyChain.methods.setPrice3(ID, price3).send({ from: currentaccount });
          console.log(reciept);
          console.log(reciept2);
          loadPrice3();
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
        var reciept2 = await SupplyChain.methods.setPrice4(ID, price4).send({ from: currentaccount });
      console.log(reciept);
      console.log(reciept2);
      loadPrice4();
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
            var reciept2 = await SupplyChain.methods.setPrice5(ID, price5).send({ from: currentaccount });
            console.log(reciept);
            console.log(reciept2);
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
                {
                    MedStage[key] === 'Raw Material Supply Stage' 
                    ? MED[key].price1
                    : MedStage[key] === 'Manufacturing Stage'
                        ? MED[key].price2
                        : MedStage[key] === 'Distribution Stage'
                            ? MED[key].price3
                            : MedStage[key] === 'Retail Stage'
                                ? MED[key].price4
                                : null // add a default value or handle case when no matching stage is found
                }
            </td>
            <td>
                {MedStage[key]}
            </td>
        </tr>
    )
})}
                </tbody>
            </table>
            <h5><b>Step 1: Supply Raw Materials</b>(Only a registered Raw Material Supplier can perform this step):-</h5>
            <form onSubmit={handlerSubmitRMSsupply}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text" onChange={handlerChangeNF} placeholder="Enter Amount of Natural Fertiizer used" required />
                <input className="form-control-sm" type="text"  onChange={handlerChangeSF} placeholder="Enter Amount of Synthetic Fertilizer used" required />
                <input className="form-control-sm" type="text"  onChange={handlerChangeOF} placeholder="Enter Amount of Organic Fertilizer used" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePrice1}  placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitRMSsupply}>Supply</button>
                <label className="btn btn-outline-success btn-sm">
      Upload Receipt
      <input type="file" onChange={handlerSubmitRMSsupply} hidden />
    </label>
            </form>
            <hr />
            <br />
            <h5><b>Step 2: Manufacture</b>(Only a registered Manufacturer can perform this step):-</h5>
            <form onSubmit={handlerSubmitManufacturing}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePH} placeholder="Enter PH of soil" required />
                <input className="form-control-sm" type="text" onChange={handlerChangeWQ} placeholder="Scale the water quality" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePrice2}  placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitManufacturing}>Manufacture</button>
                <label className="btn btn-outline-success btn-sm">
      Upload Receipt
      <input type="file" onChange={handlerSubmitRMSsupply} hidden />
    </label>
            </form>
            <hr />
            <br />
            <h5><b>Step 3: Distribute</b>(Only a registered Distributor can perform this step):-</h5>
            <form onSubmit={handlerSubmitDistribute}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text" onChange={handlerChangeTEMP} placeholder="Enter Storage room tempreature" required />
                <input className="form-control-sm" type="text" onChange={handlerChangeHUM} placeholder="Enter Storage room humidity" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePrice3}  placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitDistribute}>Distribute</button>
                <label className="btn btn-outline-success btn-sm">
      Upload Receipt
      <input type="file" onChange={handlerSubmitRMSsupply} hidden />
    </label>
            </form>
            <hr />
            <br />
            <h5><b>Step 4: Retail</b>(Only a registered Retailer can perform this step):-</h5>
            <form onSubmit={handlerSubmitRetail}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePrice4}  placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitRetail}>Retail</button>
                <label className="btn btn-outline-success btn-sm">
      Upload Receipt
      <input type="file" onChange={handlerSubmitRMSsupply} hidden />
    </label>
            </form>
            <hr />
            <br />
            <h5><b>Step 5: Mark as sold</b>(Only a registered Retailer can perform this step):-</h5>
            <form onSubmit={handlerSubmitSold}>
                <input className="form-control-sm" type="text" onChange={handlerChangeID} placeholder="Enter Product ID" required />
                <input className="form-control-sm" type="text" onChange={handlerChangePrice5}  placeholder="Enter Selling Price" required />
                <button className="btn btn-outline-success btn-sm" onSubmit={handlerSubmitSold}>Sold</button>
                <label className="btn btn-outline-success btn-sm">
      Upload Receipt
      <input type="file" onChange={handlerSubmitRMSsupply} hidden />
    </label>
            </form>
            <hr />
        </div>
    )
}

export default Supply
