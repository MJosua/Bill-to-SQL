import { useLocation } from "react-router-dom";
import CardFilterSearch from "../Function/CardFilterSearch";

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
    Select,
    Textarea
} from '@chakra-ui/react';
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '../../config';

import { FaTrashAlt } from "react-icons/fa";
import { RiEditBoxFill } from "react-icons/ri";

function TableLokasi() {
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

    const [namaProduk, setNamaProduk] = useState("");
    const [lokasi_desc, setLokasi_desc] = useState("");
    const [alamat_lokasi, setAlamat_lokasi] = useState("");
    const [namaKategori, setKategori] = useState("");
    const [id_master_produk, setId_Master_produk] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [dataLokasiKategori, setDataLokasiKategori] = useState([]);

    const [dataWarehouse, setDataWarehouse] = useState([]);
    const getDataWarehouse = async () => {
        try {
            const response = await axios.get(`${API_URL}/inven/lokasi?searchTerm=${searchTerm}&category=${category}`);
            setDataWarehouse(response.data);
        } catch (error) {
            console.error('Error fetching data warehouse', error);
        }
    };

    const getDataLokasiKategori = async () => {
        try {
            const response = await axios.get(`${API_URL}/inven/lokasi_kategori`);
            setDataLokasiKategori(response.data);
        } catch (error) {
            console.error('Error fetching data lokasi kategori', error);
        }
    };

    useEffect(() => {
        getDataLokasiKategori();
        getDataWarehouse();
    }, [category, searchTerm]);

    const resetData = () => {
        setNamaProduk("");
        setKategori("");
        setLokasi_desc("");
        setAlamat_lokasi("");
        setId_Master_produk("");
    };

    const resetCategory = () => {
        getDataLokasiKategori();
        getDataWarehouse();
    };

    const handleClickAdd = async () => {
        try {
            const response = await axios.post(API_URL + '/inven/lokasi', {

                nama_lokasi: namaProduk,
                kategori_lokasi: namaKategori,
                lokasi_desc: lokasi_desc,
                alamat_lokasi: alamat_lokasi,


            });
            if (response) {
                getDataWarehouse();
                onCloseAddItem();
                resetData();
            }
        } catch (error) {
            console.error('Error adding data', error);
        }
    };

    const handleClickDelete = async () => {
        try {
            const response = await axios.delete(API_URL + '/inven/lokasi', {
                data: { id_master_data: id_master_produk }
            });
            if (response) {
                getDataWarehouse();
                onCloseDeleteItem();
                resetData();
            }
        } catch (error) {
            console.error('Error deleting data', error);
        }
    };

    const handleClickEdit = async () => {
        try {
            const response = await axios.patch(`${API_URL}/inven/lokasi`, {
                id: id_master_produk,
                nama_lokasi: namaProduk,
                kategori_lokasi: namaKategori,
                lokasi_desc: lokasi_desc,
                alamat_lokasi: alamat_lokasi,

            });
            if (response) {
                getDataWarehouse();
                onCloseEditItem();
                resetData();
            }
        } catch (error) {
            console.error('Error updating data', error);
        }
    };

    return (
        <div className="kartu-dalam mb-4 py-4 pe-2">
            <div className="row">
                <CardFilterSearch
                    location={location}
                    handleaddbutton={onOpenAddItem}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    category={category}
                    setCategory={setCategory}
                    resetcategory={resetCategory}
                    dataCategory={dataLokasiKategori}
                    setDataCategory={setDataLokasiKategori}
                />
                <div className="col-12 pe-3 ps-4 mt-1 px-0">
                    <div className="table-responsive">
                        <table className="table table-striped table-sm table-bordered px-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama Lokasi</th>
                                    <th>Kategori</th>
                                    <th>Deskripsi</th>
                                    <th>Alamat Lokasi</th>
                                    <th style={{ width: "12%" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataWarehouse.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{item.lokasi_name}</td>
                                        <td>{item.category_name}</td>
                                        <td>{item.lokasi_desc}</td>
                                        <td>{item.alamat_lokasi}</td>
                                        <td>
                                            <Button size="sm" className="me-2 mb-2" colorScheme="yellow"
                                                onClick={() => {
                                                    setNamaProduk(item.lokasi_name);
                                                    setKategori(item.kategori_lokasi);
                                                    setLokasi_desc(item.lokasi_desc);
                                                    setAlamat_lokasi(item.alamat_lokasi);
                                                    setId_Master_produk(item.lokasi_id);
                                                    onOpenEditItem();
                                                }}
                                            >
                                                <RiEditBoxFill />
                                            </Button>
                                            <Button size="sm" className="me-2 mb-2" colorScheme="red"
                                                onClick={() => {
                                                    setNamaProduk(item.lokasi_name);
                                                    setKategori(item.category_name);
                                                    setId_Master_produk(item.lokasi_id);
                                                    onOpenDeleteItem();
                                                }}
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
                        <ModalHeader>Insert New Location</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="container">
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Nama Lokasi</div>
                                    <div className="col-7">
                                        <Input size="sm" value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Kategori</div>
                                    <div className="col-7">
                                        <Select size="sm" value={namaKategori} placeholder="category" onChange={(e) => setKategori(e.target.value)}>
                                            {dataLokasiKategori.map((dataLokasi, idx) => (
                                                <option key={idx} value={dataLokasi.category_id}>{dataLokasi.category_name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Deskripsi Lokasi</div>
                                    <div className="col-7">
                                        <Textarea value={lokasi_desc} size="sm" onChange={(e) => setLokasi_desc(e.target.value)} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Alamat</div>
                                    <div className="col-7">
                                        <Textarea value={alamat_lokasi} size="sm" onChange={(e) => setAlamat_lokasi(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant='solid' colorScheme="green" onClick={handleClickAdd}>Input</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Modal isOpen={isOpenDeleteItem} onClose={() => { onCloseDeleteItem(); resetData(); }}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Delete Confirmation</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="container">
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Nama Produk</div>
                                    <div className="col-7">
                                        <Input size="sm" value={namaProduk} isDisabled />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Kategori</div>
                                    <div className="col-7">
                                        <Input size="sm" value={namaKategori} isDisabled />
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant='solid' colorScheme="red" onClick={handleClickDelete}>Delete</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Modal isOpen={isOpenEditItem} onClose={onCloseEditItem}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Edit Item</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <div className="container">
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Nama Lokasi</div>
                                    <div className="col-7">
                                        <Input size="sm" value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Kategori</div>
                                    <div className="col-7">
                                        <Select size="sm" value={namaKategori} placeholder="category" onChange={(e) => setKategori(e.target.value)}>
                                            {dataLokasiKategori.map((dataLokasi, idx) => (
                                                <option key={idx} value={dataLokasi.category_id}>{dataLokasi.category_name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Deskripsi Lokasi</div>
                                    <div className="col-7">
                                        <Textarea value={lokasi_desc} size="sm" onChange={(e) => setLokasi_desc(e.target.value)} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-5 d-flex align-items-center">Alamat</div>
                                    <div className="col-7">
                                        <Textarea value={alamat_lokasi} size="sm" onChange={(e) => setAlamat_lokasi(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant='solid' colorScheme="yellow" onClick={handleClickEdit}>Edit</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}

export default TableLokasi;
