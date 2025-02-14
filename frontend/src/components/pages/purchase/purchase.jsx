import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";
import { ShoppingCart, ChevronDown } from "lucide-react";

function Purchase() {
    const [purchase, setPurchase] = useState("");

    useEffect (() => {
        const fetchPurchase = async () => {
            try {
                const res = await fetch("http://localhost:3000/view-purchase", {
                    credentials: "include"
                })

                const data = await res.json()
                if (res.status !== 200)
                    throw new Error(data)

                setPurchase(data)
                console.log(data)

            } catch (error) { 

            }
        }
        fetchPurchase()
    }, [])
};


export default Purchase