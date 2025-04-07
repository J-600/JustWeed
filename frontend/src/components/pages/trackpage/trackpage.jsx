import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopBar from "../../navbar/topbar";
import Loader from "../../loader/loader";
import { Truck, Clock, MapPin, CheckCircle2, CreditCard, Package } from 'lucide-react';

const TrackPackagePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const statusConfig = {
        ordered: {
            icon: <Clock className="w-5 h-5" />,
            color: 'bg-blue-500',
            textColor: 'text-blue-500'
        },
        shipped: {
            icon: <Truck className="w-5 h-5" />,
            color: 'bg-purple-500',
            textColor: 'text-purple-500'
        },
        in_transit: {
            icon: <Truck className="w-5 h-5" />,
            color: 'bg-orange-500',
            textColor: 'text-orange-500'
        },
        delivered: {
            icon: <CheckCircle2 className="w-5 h-5" />,
            color: 'bg-green-500',
            textColor: 'text-green-500'
        }
    };

    const calculateStatus = (purchaseDate, deliveryDate) => {
        const today = new Date();
        const orderDate = new Date(purchaseDate);
        const deliveryDateObj = new Date(deliveryDate);

        if (today >= deliveryDateObj) return 'delivered';
        if (today >= new Date(orderDate.setDate(orderDate.getDate() + 3))) return 'in_transit';
        if (today >= new Date(orderDate.setDate(orderDate.getDate() + 1))) return 'shipped';
        return 'ordered';
    };

    const generateStatusHistory = (purchaseDate, deliveryDate) => {
        const orderDate = new Date(purchaseDate);
        const deliveryDateObj = new Date(deliveryDate);

        const statusMap = {
            ordered: {
                date:  new Date(orderDate.setDate(orderDate.getDate())),
                location: 'Magazzino',
                details: 'Ordine ricevuto e in elaborazione'
            },
            shipped: {
                date: new Date(orderDate.setDate(orderDate.getDate() + 1)),
                location: 'Centro logistico',
                details: 'Pacco spedito dal magazzino'
            },
            in_transit: {
                date: new Date(orderDate.setDate(orderDate.getDate() + 2)),
                location: 'In transito',
                details: 'Pacco in viaggio verso la destinazione'
            },
            delivered: {
                date: deliveryDateObj,
                location: 'Destinazione',
                details: 'Pacco consegnato con successo'
            }
        };

        const currentStatus = calculateStatus(purchaseDate, deliveryDate);
        const history = [];

        Object.keys(statusMap).forEach(status => {
            const isCompleted = ['ordered', 'shipped', 'in_transit', 'delivered'].indexOf(status) < 
                              ['ordered', 'shipped', 'in_transit', 'delivered'].indexOf(currentStatus);
            const isActive = status === currentStatus;

            history.push({
                status,
                timestamp: statusMap[status].date.toISOString(),
                location: statusMap[status].location,
                details: statusMap[status].details,
                isCompleted,
                isActive
            });
        });

        return history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };

    const fetchOrder = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/products/tracking", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id }),
                credentials: "include"
            });

            if (!res.ok) throw new Error('Errore nel caricamento dell\'ordine');
            const data = await res.json();

            if (!data || Object.keys(data).length === 0) {
                setOrder(null);
                return;
            }

            setOrder({
                ...data,
                currentStatus: calculateStatus(data.date, data.deliveryDate),
                statusHistory: generateStatusHistory(data.date, data.deliveryDate)
            });

            console.log(data.date)

        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    if (loading) return <Loader />;
    if (!order) return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <TopBar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Nessun ordine trovato</h2>
                    <p className="mb-6 text-neutral-content">ID ordine: {id}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Torna alla home
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            <TopBar />

            <div className="w-full px-4 sm:px-8 pt-20 pb-14">
                <div className="max-w-7xl mx-auto">
                    {errorMessage && (
                        <div className="alert alert-error mb-6 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <div className="mb-8 pb-4 border-b border-base-300">
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <Truck className="w-10 h-10 text-primary" />
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Tracciamento Ordine
                                <span className="block text-sm text-neutral-content font-normal mt-1">
                                    ID: {id} | Data: {new Date(order.date).toLocaleDateString('it-IT')}
                                </span>
                            </span>
                        </h1>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="card bg-base-200 shadow-lg">
                                <div className="card-body">
                                    <div className="flex items-center gap-4 mb-6 p-4 bg-base-300 rounded-box">
                                        <div className={`${statusConfig[order.currentStatus].color} p-3 rounded-full`}>
                                            {statusConfig[order.currentStatus].icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold capitalize">
                                                {order.currentStatus.replace('_', ' ')}
                                            </h2>
                                            <p className="text-neutral-content">
                                                Stato attuale dell'ordine
                                            </p>
                                        </div>
                                    </div>

                                    <ul className="timeline timeline-vertical">
                                        {order.statusHistory.map((status, index) => {
                                            const isCompleted = status.isCompleted;
                                            const isActive = status.isActive;
                                            const statusColor = statusConfig[status.status].color;
                                            const textColor = statusConfig[status.status].textColor;
                                            
                                            return (
                                                <li key={status.status}>
                                                    {index !== 0 && (
                                                        <hr className={`${isCompleted ? statusColor : 'bg-gray-300'} h-8 border-2`} />
                                                    )}
                                                    <div className="timeline-start">
                                                        <div className={`timeline-box ${isCompleted ? statusColor : isActive ? `${statusColor} bg-opacity-20` : 'bg-gray-300 bg-opacity-20'} transition-all duration-300`}>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3 className={`text-lg font-semibold capitalize ${isCompleted || isActive ? textColor : 'text-gray-500'}`}>
                                                                    {status.status.replace('_', ' ')}
                                                                </h3>
                                                                <span className={`text-sm ${isCompleted ? 'text-white' : 'text-neutral-content'}`}>
                                                                    {new Date(status.timestamp).toLocaleDateString('it-IT')}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm mb-2">
                                                                <MapPin className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-neutral-content'}`} />
                                                                <span className={isCompleted ? 'text-white' : ''}>{status.location}</span>
                                                            </div>
                                                            <p className={`text-sm ${isCompleted ? 'text-white' : 'text-neutral-content'} opacity-75`}>
                                                                {status.details}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="timeline-middle">
                                                        <div className={`p-2 rounded-full ${isCompleted ? statusColor : isActive ? `${statusColor} bg-opacity-50` : 'bg-gray-300'}`}>
                                                            {isCompleted ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            ) : isActive ? (
                                                                <div className={`h-5 w-5 rounded-full ${statusColor} border-4 border-white`}></div>
                                                            ) : (
                                                                <div className="h-5 w-5 rounded-full bg-gray-300"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {index !== order.statusHistory.length - 1 && (
                                                        <hr className={`${isCompleted ? statusColor : 'bg-gray-300'} h-8 border-2`} />
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-lg">
                                <div className="card-body">
                                    <h2 className="card-title mb-4"><Package className="w-6 h-6" /> Dettagli Prodotto</h2>
                                    <div className="flex gap-4">
                                        <img
                                            src={order.img}
                                            alt={order.product_name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold">{order.product_name}</h3>
                                            <div className="flex gap-4 text-neutral-content">
                                                <p>Quantità: {order.quantity}</p>
                                                <p>Prezzo: €{order.product_price.toFixed(2)}</p>
                                            </div>
                                            <div className="mt-2">
                                                <div className="badge badge-primary badge-lg">
                                                    Totale: €{(order.product_price * order.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <div className="card bg-base-200 shadow-lg">
                                <div className="card-body">
                                    <h3 className="card-title mb-4"><MapPin className="w-6 h-6" /> Indirizzo</h3>
                                    <div className="space-y-2 text-neutral-content">
                                        <p className="font-medium">{order.address_name}</p>
                                        <p>{order.address_street}</p>
                                        <p>{order.address_city}, {order.address_zip}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-base-200 shadow-lg">
                                <div className="card-body">
                                    <h3 className="card-title mb-4"><CreditCard className="w-6 h-6" /> Pagamento</h3>
                                    <div className="space-y-2 text-neutral-content">
                                        <p>Metodo: {order.card_circuit}</p>
                                        <p>Intestatario: {order.card_nome}</p>
                                        <p>Termina con: {order.card_number.slice(-4)}</p>
                                        <p>Scadenza: {order.card_expiry}</p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to={`/products/${order.id_product}`}
                                className="btn btn-primary btn-block gap-2"
                            >
                                <Package className="w-4 h-4" />
                                Vedi prodotto
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackPackagePage;