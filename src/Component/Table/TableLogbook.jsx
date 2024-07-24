import { useLocation } from "react-router-dom";
import CardFilterSearch from "../Function/CardFilterSearch";
import * as htmlToImage from 'html-to-image';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    InputGroup,
    InputRightAddon,
    Select,
    Tooltip,
    Checkbox,
    Image

} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '../../config';
import { MdHideImage } from "react-icons/md";
import { FaImage, FaTrashAlt } from "react-icons/fa";
import { RiEditBoxFill, RiFileList3Line } from "react-icons/ri";
function TableMasterData() {
    const location = useLocation();

    const {
        isOpen: isOpenAddItem,
        onOpen: onOpenAddItem,
        onClose: onCloseAddItem
    } = useDisclosure();

    const {
        isOpen: isOpenEditItem,
        onOpen: onOpenEditItem,
        onClose: onCloseEditItem
    } = useDisclosure();

    const {
        isOpen: isOpenDeleteItem,
        onOpen: onOpenDeleteItem,
        onClose: onCloseDeleteItem
    } = useDisclosure();

    const handleaddbutton = () => {
        onOpenAddItem()
    }

    const [namaProduk, setNamaProduk] = useState();
    const handleNamaProduk = (event) => {
        setNamaProduk(event);
    }

    const [namaPanjang, setPanjang] = useState();
    const handlePanjang = (event) => {
        setPanjang(event);
    }

    const [namaDiameter, setDiameter] = useState();
    const handleDiameter = (event) => {
        setDiameter(event);
    }

    const [namaKategori, setKategori] = useState();
    const handleKategori = (event) => {
        setKategori(event);
    }

    const [lokasi, setLokasi] = useState("");


    const [useLokasi, setUseLokasi] = useState();


    const [id_master_produk, setId_Master_produk] = useState();

    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");

    const [dataInven, setDataInven] = useState({ detailedData: [] });

    const getDataInven = async () => {
        try {
            const response = await
                axios.get(`${API_URL}/billtoscan/master_data?searchTerm=${searchTerm}&category=${category}`);
            setDataInven(response.data)
            console.log("getDataInven", response.data)
        } catch (error) {
            console.error('error input data', error);
        }
    };


    useEffect(() => {
        getDataInven();
    }, [searchTerm, category])

    const [idBill, setIDBill] = useState(0);


    const [dataBilling, setDataBilling] = useState();

    const getDataBilling = async () => {
        try {
            const response = await
                axios.get(`${API_URL}/billtoscan/master_BillingData?billID=${idBill}`);
            setDataBilling(response.data)
            console.log("getDataBilling", response.data)
        } catch (error) {
            console.error('error input data', error);
        }
    };


    useEffect(() => {
        getDataBilling();
    }, [idBill])



    const handleClickAdd = async () => {
        try {
            await axios.post(API_URL + '/inven/master_data', {
                panjang: namaPanjang, // Use panjang instead of namaPanjang
                diameter: namaDiameter, // Use diameter instead of namaDiameter
                nama_produk: namaProduk, // Use nama_produk instead of namaProduk
                kategori: namaKategori,
                lokasi: lokasi


            });
            onCloseAddItem();
        } catch (error) {
            console.error('error input data', error);
            onCloseAddItem();
        }
    };

    const handleClickDelete = async () => {
        try {
            await axios.delete(API_URL + '/inven/master_data', {
                data: { id_master_data: id_master_produk }
            });
            getDataInven();
            onCloseDeleteItem();
        } catch (error) {
            console.error('error Deleted data', error);
            getDataInven();
            onCloseDeleteItem();

        }
    };

    const handleClickEdit = async () => {
        try {
            await axios.patch(`${API_URL}/inven/master_data`, {
                id: id_master_produk,
                panjang: namaPanjang, // Ensure this matches the backend field 'panjang'
                diameter: namaDiameter, // Ensure this matches the backend field 'diameter'
                nama_produk: namaProduk, // Ensure this matches the backend field 'nama_produk'
                kategori: namaKategori, // Ensure this matches the backend field 'kategori'
                lokasi_id: lokasi
            });

            getDataInven();
            onCloseEditItem();
        } catch (error) {
            console.error('Error updating data', error);
            getDataInven();
            onCloseEditItem();
        }
    };


    const [dataCategory, setDataCategory] = useState([]);
    const getDataCategory = async () => {
        try {
            const response = await
                axios.get(`${API_URL}/inven/category`);
            setDataCategory(response.data)
        } catch (error) {
            console.error('error input data', error);
        }
    };


    useEffect(() => {
        getDataCategory()
    }, [category, searchTerm])

    const resetdata = () => {
        setNamaProduk();
        setKategori();
        setPanjang();
        setDiameter();
        setId_Master_produk();
    }

    const resetcategory = () => {
        getDataCategory()
        getDataInven();
    }

    const [checkedItems, setCheckedItems] = useState([]);
    const allChecked = checkedItems.every(Boolean)
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked

    useEffect(() => {
        setCheckedItems(new Array(dataInven.detailedData.length).fill(false));
    }, [dataInven]);

    const handleCheckboxChange = (index) => (e) => {
        const updatedCheckedItems = checkedItems.map((item, idx) =>
            idx === index ? e.target.checked : item
        );
        setCheckedItems(updatedCheckedItems);
    };

    const handleAllCheckbox = () => {
        if (!allChecked) {
            setCheckedItems(new Array(dataInven.detailedData.length).fill(true));
        } else if (allChecked) {
            setCheckedItems(new Array(dataInven.detailedData.length).fill(false));

        }
    }


    useEffect(() => {
        console.log("CHECKED", checkedItems)
    }, [checkedItems])


    return (

        <div className="kartu-dalam mb-4 py-4 pe-2">



            <div className="row ">
                <CardFilterSearch
                    location={location}
                    handleaddbutton={handleaddbutton}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    category={category}
                    setCategory={setCategory}
                    resetcategory={resetcategory}
                    dataCategory={dataCategory}
                />




                <div className="col-12 pe-3 ps-4 mt-1 px-0 py-0">
                    <div className="table-responsive px-0 py-0" style={{ maxHeight: "50vw" }}>
                        <table className="table table-striped table-sm table-bordered px-0 py-0">
                            <thead className="px-0 py-0">
                                <tr className="px-0 py-0">
                                    <th className="text-center">
                                        <Checkbox
                                            isChecked={allChecked}
                                            isIndeterminate={isIndeterminate}
                                            onChange={handleAllCheckbox}
                                        />
                                    </th>
                                    <th>#</th>

                                    <th>User</th>
                                    <th>Divisi</th>
                                    <td>Advance</td>
                                    <td>BBM</td>
                                    <td>Hotel</td>
                                    <td>Tol</td>
                                    <td>Restoran</td>
                                    <td>Parkir</td>
                                    <td>Entertain</td>
                                    <td>Keterangan</td>
                                    <th className="text-center">Image</th>
                                    <th className="text-center">Detail</th>

                                </tr>
                            </thead>
                            <tbody>
                                {dataInven.detailedData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="text-center">
                                            <Checkbox
                                                isChecked={checkedItems[idx]}
                                                onChange={handleCheckboxChange(idx)}
                                            />
                                        </td>

                                        <td>{idx + 1}</td>
                                        <td>{item.employee_name}</td>
                                        <td>{item.employee_division}</td>
                                        <td>{item.Advance}</td>
                                        <td>{item.Bensin}</td>
                                        <td>{item.Hotel}</td>
                                        <td>{item.Tol}</td>
                                        <td>{item.Restaurant}</td>
                                        <td>{item.Parkir}</td>
                                        <td>{item.Entertain}</td>
                                        <td>{item.Keterangan}</td>
                                        <td className="text-center" > {
                                            < Button
                                                colorScheme=
                                                {
                                                    item.Image_path !== "-"
                                                        ?
                                                        "blue"
                                                        :
                                                        "gray"
                                                }

                                                onClick={() => {
                                                    if (item.Image_path !== "-" || !item.Image_path) {
                                                        window.open(`${API_URL}/${item.Image_path}`, '_blank');
                                                    }
                                                }}
                                                size="sm"
                                            >
                                                {item.Image_path === undefined
                                                    ?
                                                    <FaImage />
                                                    :
                                                    <MdHideImage />

                                                }

                                            </Button>

                                        }
                                        </td>
                                        <td className="text-center">
                                            {
                                                < Button
                                                    colorScheme="blue"

                                                    size="sm"
                                                    onClick={() => {
                                                        setIDBill(item.Bill_ID);
                                                        onOpenEditItem();

                                                    }}
                                                >
                                                    <RiFileList3Line />
                                                </Button>

                                            }
                                        </td>


                                    </tr>
                                )
                                )
                                }

                            </tbody>
                        </table>
                    </div>
                </div>

                <Modal isOpen={isOpenEditItem} onClose={onCloseEditItem}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader> Edit Item </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="container">
                                <div className="row mb-2">
                                    <table className="table">

                                        <thead>
                                            <tr>
                                                <th>
                                                    Item
                                                </th>
                                                <th>
                                                    Qty
                                                </th>
                                                <th>
                                                    Price
                                                </th>
                                                <th>
                                                    Diskon
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                dataBilling ?
                                                    <>
                                                        {dataBilling.detailedData.map((item) => (
                                                            <tr>
                                                                <td>
                                                                    {item.Item_Name}
                                                                </td>
                                                                <td>
                                                                    {item.Item_Quantity}
                                                                </td>
                                                                <td>
                                                                    {item.Item_Price.toLocaleString()}
                                                                </td>
                                                                <td>
                                                                    {item.Item_Price.toLocaleString()}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        <tr className="fw-bold">
                                                            <td colspan="3">
                                                                Total
                                                            </td>
                                                            <td >
                                                                {dataBilling.grandtotal.toLocaleString()}
                                                            </td>
                                                        </tr>

                                                    </>
                                                    :
                                                    <>
                                                    </>

                                            }
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>


            </div >
        </div >
    )
}
export default TableMasterData