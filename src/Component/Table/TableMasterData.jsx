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
    Checkbox

} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '../../config';

import { FaTrashAlt } from "react-icons/fa";
import { RiEditBoxFill } from "react-icons/ri";
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

    const [dataInven, setDataInven] = useState([]);

    const getDataInven = async () => {
        try {
            const response = await
                axios.get(`${API_URL}/inven/master_data?searchTerm=${searchTerm}&category=${category}`);
            setDataInven(response.data)
            console.log("DATA", response.data)

        } catch (error) {
            console.error('error input data', error);
        }
    };

    const [dataWarehouse, setDataWarehouse] = useState([]);
    const getDataWarehouse = async () => {
        try {
            const response = await axios.get(`${API_URL}/inven/lokasi?searchTerm=${searchTerm}&category=${category}`);
            setDataWarehouse(response.data);
        } catch (error) {
            console.error('Error fetching data warehouse', error);
        }
    };

    useEffect(() => {
        getDataInven();
        getDataWarehouse();
    }, [searchTerm, category])



    const handleClickAdd = async () => {
        try {
            await axios.post(API_URL + '/inven/master_data', {
                panjang: namaPanjang, // Use panjang instead of namaPanjang
                diameter: namaDiameter, // Use diameter instead of namaDiameter
                nama_produk: namaProduk, // Use nama_produk instead of namaProduk
                kategori: namaKategori,
                lokasi: lokasi


            });
            getDataInven();
            onCloseAddItem();
        } catch (error) {
            console.error('error input data', error);
            getDataInven();
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
        setCheckedItems(new Array(dataInven.length).fill(false));
    }, [dataInven]);

    const handleCheckboxChange = (index) => (e) => {
        const updatedCheckedItems = checkedItems.map((item, idx) =>
            idx === index ? e.target.checked : item
        );
        setCheckedItems(updatedCheckedItems);
    };

    const handleAllCheckbox = () => {
        if (!allChecked) {
            setCheckedItems(new Array(dataInven.length).fill(true));
        } else if (allChecked) {
            setCheckedItems(new Array(dataInven.length).fill(false));

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
                                    <th style={{ minWidth: "200px" }}>Nama Produk</th>
                                    <th>Kategori</th>
                                    <th>Lokasi</th>
                                    <th>Panjang</th>
                                    <th>Diameter</th>
                                    <th
                                        style={{ width: "12%" }}

                                    >Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {dataInven.map((item, idx) => (

                                    <tr key={idx}>
                                        <td className="text-center">
                                            <Checkbox
                                                isChecked={checkedItems[idx]}
                                                onChange={handleCheckboxChange(idx)}
                                            />
                                        </td>
                                        <td>{idx + 1}</td>
                                        <td>{item.nama_produk}</td>
                                        <td>{item.category_name}</td>
                                        <td>{item.lokasi_name}</td>
                                        <td>{item.panjang} m</td>
                                        <td>{item.diameter} cm</td>
                                        <td>
                                            <Button size="sm" className="me-2 mb-2" colorScheme="yellow"
                                                onClick={() => {
                                                    setNamaProduk(item.nama_produk);
                                                    setKategori(item.category);
                                                    setPanjang(item.panjang);
                                                    setDiameter(item.diameter);
                                                    setId_Master_produk(item.id_product);
                                                    setUseLokasi(item.lokasi_id);

                                                    onOpenEditItem();
                                                }}
                                            >
                                                <RiEditBoxFill />
                                            </Button>
                                            <Button size="sm" className="me-2 mb-2" colorScheme="red"
                                                onClick={() => {
                                                    setNamaProduk(item.nama_produk);
                                                    setKategori(item.category_name);
                                                    setId_Master_produk(item.id_product);
                                                    onOpenDeleteItem();
                                                }
                                                }
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal isOpen={isOpenAddItem} onClose={onCloseAddItem}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader> Insert New Product </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="container">
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Nama Produk
                                    </div>
                                    <div className="col-7">
                                        <Input size="sm"

                                            onChange={(event) => handleNamaProduk(event.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Kategori
                                    </div>
                                    <div className="col-7">
                                        <Select
                                            size="sm"
                                            placeholder="category"
                                            _placeholder={{ color: "gray.500" }}

                                            onChange={(event) => handleKategori(event.target.value)}
                                        >
                                            {dataCategory.map((datacategory, idx) => (
                                                <option key={idx} value={datacategory.category_id}>
                                                    {datacategory.category_id}    {datacategory.category_name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Lokasi
                                    </div>
                                    <div className="col-7">
                                        <Select
                                            size="sm"
                                            placeholder="Lokasi"
                                            _placeholder={{ color: "gray.500" }}
                                            onChange={(event) => setLokasi(event.target.value)}
                                        >
                                            {dataWarehouse.map((data, idx) => (
                                                <option key={idx}
                                                    value={data.lokasi_id}
                                                >
                                                    {data.lokasi_id}    {data.lokasi_name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Panjang
                                    </div>
                                    <div className="col-7">

                                        <Tooltip label='Place . for decimals' hasArrow arrowSize={12} placement='right'>

                                            <InputGroup size="sm">
                                                <Input
                                                    onChange={(event) => handlePanjang(event.target.value)}
                                                />
                                                <InputRightAddon className="user-select-none">
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Meter
                                                </InputRightAddon>
                                            </InputGroup>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Diameter
                                    </div>
                                    <div className="col-7">
                                        <Tooltip label='Place . for decimals' hasArrow arrowSize={12} placement='right'>
                                            <InputGroup size="sm">
                                                <Input
                                                    onChange={(event) => handleDiameter(event.target.value)}
                                                />
                                                <InputRightAddon className="user-select-none">
                                                    Centimeter
                                                </InputRightAddon>
                                            </InputGroup>
                                        </Tooltip>
                                    </div>
                                </div>




                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant='solid' colorScheme="green"
                                onClick={() => handleClickAdd()}

                            >
                                Input

                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal isOpen={isOpenDeleteItem}
                    onClose={() => {
                        onCloseDeleteItem();
                        resetdata();
                    }}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader> Delete Confirmation </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="container">
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Nama Produk
                                    </div>
                                    <div className="col-7">
                                        <Input size="sm"
                                            value={namaProduk}
                                            onChange={(event) => handleNamaProduk(event.target.value)}
                                            isDisabled
                                        />
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Kategori
                                    </div>
                                    <div className="col-7">
                                        <Input
                                            size="sm"
                                            value={namaKategori}
                                            isDisabled
                                        />


                                    </div>
                                </div>



                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant='solid' colorScheme="red"
                                onClick={() => {
                                    handleClickDelete()
                                    resetcategory()
                                }}

                            >
                                Delete

                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal isOpen={isOpenEditItem} onClose={onCloseEditItem}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader> Edit Item </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="container">
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Nama Produk
                                    </div>
                                    <div className="col-7">
                                        <Input size="sm"
                                            value={namaProduk}
                                            onChange={(event) => handleNamaProduk(event.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Kategori
                                    </div>
                                    <div className="col-7">
                                        <Select
                                            size="sm"
                                            placeholder="category"
                                            _placeholder={{ color: "gray.500" }}
                                            value={namaKategori}
                                            onChange={(event) => handleKategori(event.target.value)}
                                        >
                                            {dataCategory.map((datacategory, idx) => (
                                                <option key={idx} value={datacategory.category_id}>
                                                    {datacategory.category_name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Lokasi
                                    </div>
                                    <div className="col-7">
                                        <Select
                                            size="sm"
                                            placeholder="category"
                                            _placeholder={{ color: "gray.500" }}
                                            onChange={(event) => handleKategori(event.target.value)}
                                            value={useLokasi}
                                        >
                                            {dataWarehouse.map((datacategory, idx) => (
                                                <option key={idx} value={datacategory.lokasi_id}>
                                                    {datacategory.lokasi_name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Panjang
                                    </div>
                                    <div className="col-7">

                                        <Tooltip label='Place . for decimals' hasArrow arrowSize={12} placement='right'>

                                            <InputGroup size="sm">
                                                <Input
                                                    value={namaPanjang}
                                                    onChange={(event) => handlePanjang(event.target.value)}
                                                />
                                                <InputRightAddon className="user-select-none">
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Meter
                                                </InputRightAddon>
                                            </InputGroup>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">
                                        Diameter
                                    </div>
                                    <div className="col-7">
                                        <Tooltip label='Place . for decimals' hasArrow arrowSize={12} placement='right'>
                                            <InputGroup size="sm">
                                                <Input
                                                    value={namaDiameter}
                                                    onChange={(event) => handleDiameter(event.target.value)}
                                                />
                                                <InputRightAddon className="user-select-none">
                                                    Centimeter
                                                </InputRightAddon>
                                            </InputGroup>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant='solid' colorScheme="yellow"
                                onClick={() => {
                                    handleClickEdit();
                                }
                                }

                            >
                                Edit

                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>


            </div>
        </div >
    )
}
export default TableMasterData