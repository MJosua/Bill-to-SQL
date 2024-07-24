import { useEffect, useState } from "react";
import CardInput from "../Function/CardInput";
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
    InputLeftAddon,
    Select,
    useToast,
    Textarea
} from '@chakra-ui/react';
import { API_URL } from "../../config";
import axios from "axios";
import { FaPlusSquare, FaTrash } from "react-icons/fa";
import { Tooltip } from '@chakra-ui/react'

function TableTransaction() {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const {
        isOpen: isOpenDeleteItem,
        onOpen: onOpenDeleteItem,
        onClose: onCloseDeleteItem
    } = useDisclosure();

    const {
        isOpen: isOpenSubmitItem,
        onOpen: onOpenSubmitItem,
        onClose: onCloseSubmitItem
    } = useDisclosure();

    const [image, setImage] = useState(null);
    const [selectedimage, setSelectedImage] = useState(null);
    const [ocrResult, setOcrResult] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [discountTotal, setDiscountTotal] = useState();
    const [grandTotal, setGrandTotal] = useState(0);
    const [itemIndex, setItemIndex] = useState();
    const [nameIndex, setNameIndex] = useState();
    const [selectType, setSelectType] = useState();
    const [selectDate, setSelectDate] = useState();
    const [tipeDiskon, setTipeDiskon] = useState("");

    const initialOrders = {
        "company-information": [
            {
                "company-name": "",
                "company-address": "",
                "employee-name": "",
                "customer-name": "",

            }
        ],
        "item-information": [
            {
                "item-name": "",
                "item-price": "",
                "item-discount": "",
                "item-quantity": "",
                "item-totalprice": ""
            }
        ],
        "bill-information": [
            {
                "total-price": "",
                "bill-date": "",
                "bill-type": "",
                "total-discount": "",
                "remarks": ""
            }
        ]
    };

    const [transactionOrder, setTransactionOrder] = useState(() => {
        const storedOrders = sessionStorage.getItem('sessionData');
        return storedOrders ? JSON.parse(storedOrders) : initialOrders;
    });

    const handleInputChange = (section, index, key, value) => {
        const newOrder = { ...transactionOrder };
        newOrder[section][index][key] = value;
        setTransactionOrder(newOrder);
    };

    const handleDeleteItem = (index) => {
        const newOrder = { ...transactionOrder };
        newOrder['item-information'] = newOrder['item-information'].filter((_, i) => i !== index);
        setTransactionOrder(newOrder);
        onCloseDeleteItem();
    };

    const handleAddItem = () => {
        const newItem = {
            'item-name': '',
            'item-quantity': '',
            'item-price': '',
            'item-discount': '',
            'item-totalprice': ''
        };
        const newOrder = { ...transactionOrder };
        newOrder['item-information'] = [...newOrder['item-information'], newItem];
        setTransactionOrder(newOrder);
    };

    const calculateGrandTotal = () => {
        let total = 0;
        transactionOrder['item-information'].forEach(item => {
            const price = parseFloat(item['item-price']?.replace(',', '') || '0');
            const quantity = parseFloat(item['item-quantity']?.replace(',', '') || '0');
            const discount = parseFloat(item['item-discount']?.replace(',', '') || '0');
            if (!isNaN(quantity) && quantity !== 0) {
                const itemTotal = (price - discount) * quantity;
                total += itemTotal;
            }
        });

        if (tipeDiskon === "rupiah") {
            total = total - discountTotal;
        } else if (tipeDiskon === "persen") {
            total = total - (total * discountTotal / 100);
        }

        setGrandTotal(total.toFixed(2));
        const newOrder = { ...transactionOrder };
        if (newOrder['bill-information'][0]) {
            newOrder['bill-information'][0]['total-price'] = total.toFixed(2);
        }
        setTransactionOrder(newOrder);
    };

    useEffect(() => {
        calculateGrandTotal();
        sessionStorage.setItem('sessionData', JSON.stringify(transactionOrder));
    }, [transactionOrder, discountTotal, tipeDiskon]);


    const handleSubmit = async () => {
        setLoading(true);
        try {
            const isValidDateFormat = (dateString) => {
                const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
                return dateFormatRegex.test(dateString);
            };

            const items = transactionOrder['item-information'];
            const bill = transactionOrder['bill-information'];

            const findNullKey = (object) => {
                for (let key in object) {
                    if (key !== 'item-discount' && key !== 'item-totalprice' && key !== 'total-discount' && object[key] === null) {
                        return key;
                    } else if (key === 'bill-date' && !isValidDateFormat(object[key])) {
                        return key;
                    }
                }
                return null;
            };

            const findNullIndexAndKey = (data) => {
                for (let i = 0; i < data.length; i++) {
                    const nullKey = findNullKey(data[i]);
                    if (nullKey !== null) {
                        return { index: i, key: nullKey };
                    }
                }
                return null;
            };



            const itemsNullInfo = findNullIndexAndKey(items);
            if (itemsNullInfo !== null) {
                const itemName = items[itemsNullInfo.index]['item-name'];
                toast({
                    title: `Error`,
                    description: `Item ${itemsNullInfo.index + 1}: Jumlah "${itemName}" masih kosong.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const billNullInfo = findNullIndexAndKey(bill);
            if (billNullInfo !== null) {
                toast({
                    title: `Error`,
                    description: `Bill ${billNullInfo.index + 1}: The attribute "${billNullInfo.key}" is empty.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const formData = new FormData();
            formData.append('photo', selectedFile);
            formData.append('sessionData', JSON.stringify(transactionOrder));

            const response = await axios.post(`${API_URL}/billtoscan/master_data`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setSelectedFile(null);
                setTransactionOrder(initialOrders);
                onCloseSubmitItem();
                toast({
                    title: `Success`,
                    description: `Berhasil Submit Data.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }








        } catch (error) {
            toast({
                title: `Error`,
                description: `${error.message} or Maybe Item is empty`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const [employeeList, setEmployeeList] = useState([]);
    const getDataEmployee = async () => {
        try {
            const response = await
                axios.get(`${API_URL}/billtoscan/master_employee`)
            console.log("employeeList", response.data)
            setEmployeeList(response.data);
        } catch (error) {
            console.error('error input data', error);
        }
    };
    useEffect(() => {
        getDataEmployee();
    }, [])


    const [billTipeList, setBillTipeList] = useState([]);
    const getDataBillTipe = async () => {
        try {
            const response = await
                axios.get(`${API_URL}/billtoscan/master_BillTipe`)
            console.log("billTipeList", response.data)
            setBillTipeList(response.data)
        } catch (error) {
            console.error('error input data', error);
        }
    };
    useEffect(() => {
        getDataBillTipe();
    }, [])



    return (
        <div className="mb-4 pb-4 pe-2">
            <div className="row">
                <div className="col-12 d-flex justify-content-center">

                </div>
                <div className="col-12 pe-3 ps-4 mt-2 px-0 d-block no-overflow">
                    <div className="row" style={{ paddingBottom: '8px' }}>
                        <div className="col-2 d-flex align-items-center">
                            <h3>DATA TAGIHAN  </h3>
                        </div>
                        <div className="col-10 row">

                            <Tooltip label='Input Gambar dan Autofill'>
                                <div className="col-4 d-flex align-items-end pb-2">
                                    <CardInput
                                        image={image}
                                        setImage={setImage}
                                        selectedimage={selectedimage}
                                        setSelectedImage={setSelectedImage}
                                        ocrResult={ocrResult}
                                        setOcrResult={setOcrResult}
                                        setPrompt={setPrompt}
                                        prompt={prompt}
                                        loading={loading}
                                        setLoading={setLoading}
                                        setItems={(items) => handleInputChange('item-information', 0, 'item-information', items)}
                                        setSelectDate={setSelectDate}
                                        setSelectType={setSelectType}
                                        setTipeDiskon={setTipeDiskon}
                                        setDiscountTotal={setDiscountTotal}
                                        selectedFile={selectedFile}
                                        setSelectedFile={setSelectedFile}
                                        transactionOrder={transactionOrder}
                                        setTransactionOrder={setTransactionOrder}
                                    />
                                </div>
                            </Tooltip>

                            <div className="col-3 d-flex align-items-end pb-3">

                                {transactionOrder['company-information'].map((companyInformation, index) => (
                                    <Tooltip label='Nama Pekerja '>
                                        <InputGroup size="sm" key={index}>
                                            <InputLeftAddon>Employee</InputLeftAddon>
                                            <Select
                                                placeholder='Pilih Tipe'
                                                value={companyInformation['employee-name'] || ''}
                                                onChange={(e) => handleInputChange('company-information', index, 'employee-name', e.target.value)}
                                            >
                                                {employeeList.map((employee, idx) => (
                                                    <option key={idx} value={employee.employee_id}>{employee.employee_name}</option>
                                                ))}
                                            </Select>
                                        </InputGroup>
                                    </Tooltip>
                                ))}
                            </div>




                            <div className="col-4 d-flex align-items-end pb-3">
                                {transactionOrder['bill-information'].map((billInformation, index) => (
                                    <Tooltip label='Input Tanggal'>
                                        <InputGroup size="sm" key={index}>
                                            <InputLeftAddon className="pe-4">Tanggal </InputLeftAddon>
                                            <Input
                                                type="date"
                                                value={billInformation['bill-date'] || ''}
                                                onChange={(e) => handleInputChange('bill-information', index, 'bill-date', e.target.value)}
                                                style={{ textAlign: 'left' }}
                                            />
                                        </InputGroup>
                                    </Tooltip>
                                ))}
                            </div>

                            <div className="col-4 d-flex align-items-end pb-3">
                                {transactionOrder['company-information'].map((companyInformation, index) => (
                                    <Tooltip label='input nama toko'>
                                        <InputGroup size="sm" key={index}>
                                            <InputLeftAddon>Toko</InputLeftAddon>
                                            <Input
                                                value={companyInformation['company-name'] || ''}
                                                onChange={(e) => handleInputChange('company-information', index, 'company-name', e.target.value)}
                                                style={{ textAlign: 'left' }}
                                            />
                                        </InputGroup>
                                    </Tooltip>
                                ))}
                            </div>

                            <div className="col-3 d-flex align-items-end pb-3">

                                {transactionOrder['bill-information'].map((billInformation, index) => (
                                    <Tooltip label='Tipe Bil '>
                                        <InputGroup size="sm" key={index}>
                                            <InputLeftAddon>Bill Type</InputLeftAddon>
                                            <Select
                                                placeholder='Pilih Tipe'
                                                value={billInformation['bill-type'] || ''}
                                                onChange={(e) => handleInputChange('bill-information', index, 'bill-type', e.target.value)}
                                            >
                                                {billTipeList.map((billtipe, idx) => (
                                                    <option key={idx} value={billtipe.BillTipe_ID}>{billtipe.BillTipe_Name}</option>
                                                ))}
                                            </Select>
                                        </InputGroup>
                                    </Tooltip>
                                ))}
                            </div>

                            <div className="col-4 d-flex align-items-end pb-3">

                                {transactionOrder['company-information'].map((companyInformation, index) => (
                                    <Tooltip label=' Opsional, masukkan nama perusahaan untuk entertainment '>
                                        <InputGroup size="sm" key={index}>
                                            <InputLeftAddon>Customer</InputLeftAddon>
                                            <Input
                                                value={companyInformation['customer-name'] || ''}
                                                onChange={(e) => handleInputChange('company-information', index, 'customer-name', e.target.value)}

                                            />
                                        </InputGroup>
                                    </Tooltip>
                                ))}
                            </div>


                        </div>



                    </div>
                    <div className="row">
                        <div className="col-12">

                            <table className="table table-bordered table-responsive table-hover  table-sm" id="productTable">
                                <thead className="text-white bg-secondary" style={{ textAlign: 'center' }}>
                                    <tr>
                                        <th className="col-1">No</th>
                                        <th className="col-4">Item Name</th>
                                        <th className="col-2">Qty</th>
                                        <th className="col-2">Price</th>
                                        <th className="col-2">Discount</th>
                                        <th></th>
                                        <th className="col-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                    {transactionOrder['item-information'].map((itemInformation, index) => (
                                        <tr key={index}>
                                            <td className="align-middle">{index + 1}</td>
                                            <td>
                                                <Input
                                                    size='sm'
                                                    value={itemInformation['item-name'] || ''}
                                                    onChange={(e) => handleInputChange('item-information', index, 'item-name', e.target.value)}
                                                    style={{ textAlign: 'center' }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    size='sm'
                                                    value={itemInformation['item-quantity'] || ''}
                                                    onChange={(e) => handleInputChange('item-information', index, 'item-quantity', e.target.value)}
                                                    style={{ textAlign: 'center' }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    size='sm'
                                                    value={itemInformation['item-price'] || ''}
                                                    onChange={(e) => handleInputChange('item-information', index, 'item-price', e.target.value)}
                                                    style={{ textAlign: 'center' }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    size='sm'
                                                    value={itemInformation['item-discount'] || ''}
                                                    onChange={(e) => handleInputChange('item-information', index, 'item-discount', e.target.value)}
                                                    style={{ textAlign: 'center' }}
                                                />
                                            </td>
                                            <td>

                                            </td>
                                            <td>
                                                <Tooltip label='Hapus baris item'>
                                                    <Button size="sm" colorScheme="red" onClick={() => { setItemIndex(index); onOpenDeleteItem(); }} >
                                                        <FaTrash className="text-white" />
                                                    </Button>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))}

                                    <tr >
                                        <td></td>
                                        <td>

                                        </td>
                                        <td>

                                        </td>
                                        <td>

                                        </td>
                                        <td>

                                        </td>
                                        <td>

                                        </td>
                                        <td>
                                            <Tooltip label='Tambah Baris Item'>

                                                <Button size="sm" colorScheme="green" onClick={() => handleAddItem()}>
                                                    <FaPlusSquare className="text-white" />
                                                </Button>
                                            </Tooltip>
                                        </td>
                                    </tr>

                                    <tr >
                                        <th className="align-middle">
                                            Keterangan
                                        </th>
                                        <td colSpan="4">
                                            {transactionOrder['bill-information'].map((billInformation, index) => (
                                                <Tooltip label='input Keterangan'>


                                                    <Input
                                                        value={billInformation['remarks'] || ''}
                                                        onChange={(e) => handleInputChange('bill-information', index, 'remarks', e.target.value)}
                                                        style={{ textAlign: 'left' }}
                                                    />



                                                </Tooltip>
                                            ))}

                                        </td>

                                        <td>

                                        </td>
                                        <td>

                                        </td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <div className="col-4 text-end">
                                <h4>Discount</h4>
                                <InputGroup size="sm">
                                    <Select
                                        placeholder='Pilih Diskon'
                                        value={tipeDiskon}
                                        onChange={(e) => setTipeDiskon(e.target.value)}
                                    >
                                        <option value='rupiah'>Rupiah</option>
                                        <option value='persen'>Persen</option>
                                    </Select>
                                    <Input
                                        value={discountTotal}
                                        placeholder="0"
                                        disabled={tipeDiskon === ""}
                                        onChange={(e) => setDiscountTotal(e.target.value)}
                                        style={{ textAlign: 'center' }}
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="col-12 d-flex justify-content-end">
                            <div className="col-4" style={{ textAlign: 'right' }}>
                                <h4>Grand Total</h4>
                                <Input
                                    value={grandTotal}
                                    isReadOnly
                                    size="sm"
                                    style={{ textAlign: 'center' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <div className="row mt-3" style={{ textAlign: 'center' }}>
                <div className="col-12 d-flex justify-content-end">
                    <Button
                        colorScheme="green"
                        className="px-5 pt-1"
                        size={"sm"}
                        onClick={onOpenSubmitItem}>SUBMIT</Button>
                </div>
            </div>


            <Modal isOpen={isOpenDeleteItem} onClose={onCloseDeleteItem}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Item</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>Are you sure you want to delete this item?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" onClick={() => handleDeleteItem(itemIndex)}>Yes</Button>
                        <Button ml={3} onClick={onCloseDeleteItem}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenSubmitItem} onClose={onCloseSubmitItem}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Submit Items</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>Are you sure you want to submit these items?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>Yes</Button>
                        <Button ml={3} onClick={onCloseSubmitItem}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </div >
    );
}

export default TableTransaction;
