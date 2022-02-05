import React,{useState, useEffect} from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContexts'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebase from "../firebase";

export default function Dashboard() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [recycleBins, setRecycleBins] = useState([]);
    const [loading, setLoading] = useState(false);

    const ref = firebase.firestore().collection("recyclebins")

    function getRecycleBins(){
        setLoading(true)
        ref.onSnapshot((querySnapshot) =>{
            const items = [];
            querySnapshot.forEach((doc)=>{
                items.push(doc.data());
            })
            setRecycleBins(items)
            setLoading(false)
        })        
    }

    useEffect(() => {
        getRecycleBins();
    }, [])

    async function handleLogout(){

        try {
            await logout()
            navigate('/')
        } catch {
            toast.error('Failed to log out')
        }
        
    }

    var sortByAdress = function(a, b){
        if(a.adress < b.adress) { return -1; }
        if(a.adress > b.adress) { return 1; }
        return 0;
    }

    function deleteUser(recycleBin) {
        ref
            .doc(recycleBin.id)
            .delete()
            .catch((err)=>{
                console.error(err);
            });
    }

    return (
        <>
            <div style = {{paddingTop: '20px'}}>
                <Row className="align-items-center">
                    <Col>
                        <h1>Recycle Bins</h1>
                    </Col>
                    <Col className="text-end ">
                        <Button onClick={handleLogout} className="btn btn-sm btn-dark" type="submit">
                            Log Out
                        </Button>  
                    </Col>
                </Row>
                <Row className="align-items-center">
                    <Col>
                        <Link to={`/dashboard/add`} className="btn btn-sm btn-success mb-2">Add a bin</Link>
                    </Col>
                </Row>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th style={{ width: '19%' }}>Adress</th>
                            <th style={{ width: '19%' }}>Borough</th>
                            <th style={{ width: '19%' }}>Latitude</th>
                            <th style={{ width: '19%' }}>Longitude</th>
                            <th style={{ width: '19%' }}>Site Type</th>
                            <th style={{ width: '5%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {recycleBins && recycleBins
                            .sort(sortByAdress)
                            .map(recycleBin =>
                                <tr key={recycleBin.id}>
                                    
                                    <td>{recycleBin.adress}</td>
                                    <td>{recycleBin.borough}</td>
                                    <td>{recycleBin.location.latitude}</td>
                                    <td>{recycleBin.location.longitude}</td>
                                    <td>{recycleBin.site_type}</td>

                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <Link to={`/dashboard/edit/${recycleBin.id}`}
                                        className="btn btn-sm btn-primary mr-1">
                                            Edit
                                        </Link>

                                        <button onClick={() => deleteUser(recycleBins.id)}
                                        className="btn btn-sm btn-danger btn-delete-user"
                                        disabled={recycleBins.isDeleting}>
                                            {
                                                recycleBin.isDeleting 
                                                ? <span className="spinner-border spinner-border-sm"></span>
                                                : <span>Delete</span>
                                            }
                                        </button>
                                    </td>
                                </tr>
                    )}
                    {!recycleBins &&
                        <tr>
                            <td colSpan="5" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {recycleBins && !recycleBins.length &&
                        <tr>
                            <td colSpan="5" className="text-center">
                                <div className="p-2">No Recycle bin To Display</div>
                            </td>
                        </tr>
                    }
                    </tbody>                    
                </table>
            </div>     
            <ToastContainer />
        </>
    )
}
