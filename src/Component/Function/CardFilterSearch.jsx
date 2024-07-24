import {
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    Select,
    Textarea,
    useDisclosure,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
} from "@chakra-ui/react"

import { FaTrashAlt } from "react-icons/fa";
import { RiEditBoxFill } from "react-icons/ri";
import Filter from "../Pagination/Filter";
import { IoSearch } from "react-icons/io5";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import axios from "axios";
function CardFilterSearch({
    location,
    handleaddbutton,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    resetcategory,
    dateLog,
    setStartingDate,
    setEndingDate,
    dataCategory,
    handleLimitChange,
    limit,
    
}) {


    const [selectedCategory, setSelectedCategory] = useState("")


    const {
        isOpen: isOpenAddCategory,
        onOpen: onOpenAddCategory,
        onClose: onCloseAddCategory
    } = useDisclosure();

    const {
        isOpen: isOpenAddCategoryLokasi,
        onOpen: onOpenAddCategoryLokasi,
        onClose: onCloseAddCategoryLokasi
    } = useDisclosure();

    const {
        isOpen: isOpenDeleteCategoryLokasi,
        onOpen: onOpenDeletenCategoryLokasi,
        onClose: onCloseDeleteCategoryLokasi
    } = useDisclosure();


    const {
        isOpen: isOpenOptionCategory,
        onOpen: onOpenOptionCategory,
        onClose: onCloseOptionCategory
    } = useDisclosure();

    const {
        isOpen: isOpenEditCategory,
        onOpen: onOpenEditnCategory,
        onClose: onCloseEditCategory
    } = useDisclosure();

    const {
        isOpen: isOpenDeleteCategory,
        onOpen: onOpenDeletenCategory,
        onClose: onCloseDeleteCategory
    } = useDisclosure();


    const [categoryNew, setCategoryNew] = useState("");
    const [categoryDesc, setCategoryDesc] = useState("");


    const handleClickNewCategory = async () => {
        try {
            const response = await
                axios.post(API_URL + '/inven/category', {
                    category_name: categoryNew,
                    category_desc: categoryDesc
                });
            if (response) {

                setCategoryNew("");
                setCategoryDesc("");
                resetcategory();
                onCloseAddCategory();
            }

        } catch (err) {
            console.error('error input data', err);
            onCloseAddCategory();

            resetcategory();

        }
    }

    const handleClickNewCategoryLokasi = async () => {
        try {
            const response = await
                axios.post(API_URL + '/inven/lokasi_kategori', {
                    categoryLokasi_name: categoryNew,
                    categoryLokasi_desc: categoryDesc,
                });
            if (response) {
                setCategoryNew("");
                setCategoryDesc("");
                setSearchTerm("");
                resetcategory();
                onCloseAddCategoryLokasi();
            }

        } catch (err) {
            console.error('error input data', err);
            onCloseAddCategoryLokasi();

        }
    }

    const handleClickEditCategory = async () => {
        try {
            const response = await
                axios.patch(API_URL + '/inven/category', {
                    category_name: categoryNew,
                    category_desc: categoryDesc,
                    category_id: selectedCategory
                });
            if (response) {
                setCategoryNew("")
                setCategoryDesc("")

                resetcategory();

                onCloseEditCategory();
            }

        } catch (err) {
            console.error('error input data', err);
            onCloseEditCategory();

        }
    }

    const handleClickEditCategoryLokasi = async () => {
        try {
            const response = await
                axios.patch(API_URL + '/inven/lokasi_kategori', {
                    category_name: categoryNew,
                    category_desc: categoryDesc,
                    category_id: selectedCategory
                });
            if (response) {
                setCategoryNew("")
                setCategoryDesc("")

                resetcategory();

                onCloseEditCategory();
            }

        } catch (err) {
            console.error('error input data', err);
            onCloseEditCategory();

        }
    }

    const handleClickDeleteCategory = async () => {
        try {
            const response = await
                axios.delete(API_URL + '/inven/category', {
                    data: {
                        category_id: selectedCategory,
                        category_name: categoryNew
                    }
                });

            if (response) {
                setCategoryNew("")
                setCategoryDesc("")
                resetcategory();
                onCloseDeleteCategory();
            }

        } catch (err) {
            console.error('error input data', err);
            onCloseDeleteCategory();


            resetcategory();
        }
    }



    const handleClickDeleteCategoryLokasi = async () => {
        try {
            const response = await axios.delete(API_URL + '/inven/lokasi_kategori', {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    category_id: selectedCategory,
                    category_name: categoryNew
                }
            });
            if (response) {
                setCategoryNew("");
                setCategoryDesc("");
                resetcategory();
                onCloseDeleteCategoryLokasi();
            }

        } catch (err) {
            console.error('error input data', err);
            onCloseDeleteCategoryLokasi();

        }
    }

    return (

        <div className="col-12">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6 col-md-4   mb-2">
                        {location && location.pathname.includes("logbook") ? (
                            <div className="  text-grey ">
                                <Filter
                                    handleLimitChange={handleLimitChange}
                                    limit={limit}
                                />
                            </div>
                        ) : (
                            <div className="col-12">
                                <Button colorScheme="teal" size="sm"
                                    onClick={
                                        () => handleaddbutton()
                                    }
                                >
                                    Add New
                                </Button>

                            </div>
                        )}


                    </div>

                    <div className="col-md-3 col-6  pe-0 mb-2 d-block d-md-none d-flex align-items-center">
                        <InputGroup size='sm' >
                            <Input placeholder='Search' />
                            <InputRightAddon>
                                <IoSearch />
                            </InputRightAddon>

                        </InputGroup>
                    </div>






                    {location && location.pathname.includes("masterdata") ? (
                        <div className="col-6 col-md-3 mb-1 d-flex justify-content-end d-none">
                        </div>
                    ) : (
                        <div className="col-6 col-md-2   text-grey mb-2 ">

                            <Select
                                size="sm"
                                onChange={(e) => setStartingDate(e.target.value)}
                            >
                                <option value="">
                                    Filter Date From
                                </option>
                                {dateLog && dateLog !== 'undefined' ?
                                    dateLog
                                        // Sort dates in descending order
                                        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                                        .map((date, idx) => (
                                            <option key={idx} value={date.event_date}>
                                                {date.event_date}
                                            </option>
                                        ))
                                    :
                                    ""
                                }
                            </Select>
                        </div>

                    )}

                    {location && location.pathname.includes("masterdata") ? (
                        <div className="col-12 pe-0 col-md-4 mb-2 d-flex justify-content-between justify-content-md-end">

                            

                            <Button colorScheme="yellow" className="px-3" size="sm"
                                onClick={
                                    () => onOpenOptionCategory()
                                }
                            >
                                Category Option
                            </Button>


                        </div>

                    ) : (
                        <div className="col-6 col-md-2  text-grey  mb-2">
                            <Select
                                size="sm"
                                onChange={(e) => setEndingDate(e.target.value)}

                            >
                                <option value="">
                                    Filter Date Until
                                </option>
                                {dateLog && dateLog !== 'undefined' ?
                                    dateLog
                                        .sort((b, a) => new Date(a.event_date) - new Date(b.event_date))
                                        .map((date, idx) => (
                                            <option key={idx} value={date.event_date}>
                                                {date.event_date}
                                            </option>
                                        ))
                                    :
                                    ""
                                }
                            </Select>
                        </div>
                    )}


                    <div className="col-md-2 col-12  pe-0 mb-2">
                        <Select
                            size="sm"
                            placeholder="category"
                            _placeholder={{ color: "gray.500" }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >

                            {
                                location.pathname.includes("masterdata") ?
                                    dataCategory.map((categorylist, idx) => (
                                        <option key={idx} value={categorylist.id}>{categorylist.category_name}</option>
                                    ))
                                    :
                                    (location.pathname.includes("logbook") ?
                                        <>
                                            <option value={1}>Insert</option>
                                            <option value={2}>Delete</option>
                                            <option value={3}>Update</option>
                                        </>
                                        :
                                        null
                                    )
                            }

                        </Select>
                    </div>
                    <div className="col-md-2 col-6  pe-0 mb-2 d-none d-md-block">
                        <InputGroup size='sm' >
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder='Search'
                            />
                            <InputRightAddon>
                                <IoSearch />
                            </InputRightAddon>

                        </InputGroup>
                    </div>

                </div>
            </div>

            <Modal isOpen={isOpenOptionCategory} onClose={onCloseOptionCategory}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> Category  Option </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Button variant='solid' colorScheme="green"
                            onClick={() =>
                                location.pathname.includes("lokasi") ?
                                    onOpenAddCategoryLokasi()
                                    :
                                    onOpenAddCategory()

                            }
                            size="sm"
                        >
                            Add new
                        </Button>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        #
                                    </th>
                                    <th>
                                        Kategori
                                    </th>
                                    <th>
                                        Deskripsi
                                    </th>
                                    <th>
                                        Quantity
                                    </th>
                                    <th className="d-flex justify-content-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataCategory.map((data, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            {idx + 1}
                                        </td>
                                        <td>
                                            {data.category_name}
                                        </td>
                                        <td>
                                            {data.category_desc}
                                        </td>
                                        <td>
                                            {data.quantity}
                                        </td>
                                        <td className="d-flex justify-content-center">
                                            <Button size="sm" className="me-2 mb-2" colorScheme="yellow"
                                                onClick={() => {
                                                    setCategoryNew(data.category_name);
                                                    setCategoryDesc(data.category_desc);
                                                    setSelectedCategory(data.category_id);
                                                    onOpenEditnCategory();
                                                }
                                                }
                                            >
                                                <RiEditBoxFill />
                                            </Button>
                                            <Button size="sm" className="me-2 mb-2" colorScheme="red"
                                                onClick={() => {
                                                    setCategoryNew(data.category_name);
                                                    setSelectedCategory(data.category_id)
                                                    location.pathname.includes("lokasi") ?
                                                        onOpenDeletenCategoryLokasi()
                                                        :
                                                        onOpenDeletenCategory()


                                                }}

                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </ModalBody>
                    <ModalFooter>

                        <Button variant='solid' colorScheme="red"
                            className="px-3 ms-3"
                            onClick={() => onCloseOptionCategory()}
                            size="sm"
                        >
                            Exit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenAddCategory} onClose={onCloseAddCategory}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> Add New Category </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="container">
                            <div className="row mb-2">
                                <div className="col-5 d-flex align-items-center">
                                    Category Name
                                </div>
                                <div className="col-7">
                                    <Input size="sm"
                                        value={categoryNew}
                                        onChange={(event) => setCategoryNew(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col-5 d-flex align-items-top">
                                    Description
                                </div>
                                <div className="col-7">
                                    <Textarea
                                        size="sm"
                                        placeholder="Deskripsi, boleh kosong"
                                        height="200px"
                                        type="text"
                                        value={categoryDesc}
                                        onChange={(event) => setCategoryDesc(event.target.value)}
                                    />
                                </div>
                            </div>

                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' colorScheme="green"
                            onClick={() => handleClickNewCategory()}
                            size="sm"
                        >
                            Input
                        </Button>
                        <Button variant='solid' colorScheme="red"
                            className="px-3 ms-3"
                            onClick={() => onCloseAddCategory()}
                            size="sm"
                        >
                            Exit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenAddCategoryLokasi} onClose={onCloseAddCategoryLokasi}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> Add New Category for Lokasi</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="container">
                            <div className="row mb-2">
                                <div className="col-5 d-flex align-items-center">
                                    Category Name
                                </div>
                                <div className="col-7">
                                    <Input size="sm"
                                        value={categoryNew}
                                        onChange={(event) => setCategoryNew(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col-5 d-flex align-items-top">
                                    Description
                                </div>
                                <div className="col-7">
                                    <Textarea
                                        size="sm"
                                        placeholder="Deskripsi, boleh kosong"
                                        height="200px"
                                        type="text"
                                        value={categoryDesc}
                                        onChange={(event) => setCategoryDesc(event.target.value)}
                                    />
                                </div>
                            </div>

                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' colorScheme="green"
                            onClick={() => handleClickNewCategoryLokasi()}
                            size="sm"
                        >
                            Input
                        </Button>
                        <Button variant='solid' colorScheme="red"
                            className="px-3 ms-3"
                            onClick={() => onCloseAddCategory()}
                            size="sm"
                        >
                            Exit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenDeleteCategory} onClose={onCloseDeleteCategory}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> Delete Confirmation </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="container">
                            <div className="row mb-2">
                                <div className="col-5 d-flex align-items-center">
                                    Category Name
                                </div>
                                <div className="col-7">
                                    <Input size="sm"
                                        isDisabled
                                        value={categoryNew}
                                        onChange={(event) => setCategoryNew(event.target.value)}
                                    />
                                </div>
                            </div>


                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' colorScheme="red"
                            onClick={() => handleClickDeleteCategory()}
                            size="sm"
                        >
                            Delete
                        </Button>
                        <Button variant='solid' colorScheme="red"
                            className="px-3 ms-3"
                            onClick={() => onCloseDeleteCategory()}
                            size="sm"
                        >
                            Exit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenDeleteCategoryLokasi} onClose={onCloseDeleteCategoryLokasi}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> Delete for Lokasi Confirmation </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="container">
                            <div className="row mb-2">
                                <div className="col-5 d-flex align-items-center">
                                    Category Name
                                </div>
                                <div className="col-7">
                                    <Input size="sm"
                                        isDisabled
                                        value={categoryNew}
                                        onChange={(event) => setCategoryNew(event.target.value)}
                                    />
                                </div>
                            </div>


                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' colorScheme="red"
                            onClick={() => handleClickDeleteCategoryLokasi()}
                            size="sm"
                        >
                            Delete
                        </Button>
                        <Button variant='solid' colorScheme="red"
                            className="px-3 ms-3"
                            onClick={() => onCloseDeleteCategoryLokasi()}
                            size="sm"
                        >
                            Exit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenEditCategory} onClose={onCloseEditCategory}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader> Edit Data </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="container">
                            <div className="row mb-2">
                                <div className="col-5 d-flex align-items-center">
                                    Category Name
                                </div>
                                <div className="col-7">
                                    <Input size="sm"
                                        value={categoryNew}
                                        onChange={(event) => setCategoryNew(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col-5 d-flex align-items-top">
                                    Description
                                </div>
                                <div className="col-7">
                                    <Textarea
                                        size="sm"
                                        placeholder="Deskripsi, boleh kosong"
                                        height="200px"
                                        type="text"
                                        value={categoryDesc}
                                        onChange={(event) => setCategoryDesc(event.target.value)}
                                    />
                                </div>
                            </div>

                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' colorScheme="yellow"
                            onClick={() => {
                                location.pathname.includes("masterdata/lokasi") ?
                                    handleClickEditCategoryLokasi()
                                    :
                                    location.pathname.includes("masterdata/produk") ?
                                        handleClickEditCategory()
                                        :
                                        alert("Invalid location for editing")
                            }}
                            size="sm"
                        >
                            Edit
                        </Button>
                        <Button variant='solid' colorScheme="red"
                            className="px-3 ms-3"
                            onClick={() => onCloseEditCategory()}
                            size="sm"
                        >
                            Exit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>



        </div >

    )
}

CardFilterSearch.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
};
export default CardFilterSearch