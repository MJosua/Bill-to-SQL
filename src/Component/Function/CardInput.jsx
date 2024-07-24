import { MdOutlineFileUpload } from "react-icons/md";
import { FaCamera } from "react-icons/fa6";
import ImageUpload from "./ImageUpload";
import OCRComponent from "./OCRComponent";
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

} from '@chakra-ui/react'
import { useState } from "react";


function CardInput({
    image,
    setImage,
    ocrResult,
    setOcrResult,
    selectedimage,
    setSelectedImage,
    setPrompt,
    prompt,
    loading,
    setLoading,
    setItems,
    setSelectDate,
    setSelectType,
    setTipeDiskon,
    setDiscountTotal,
    selectedFile,
    setSelectedFile,
    transactionOrder,
    setTransactionOrder
}) {


    const {
        isOpen: isOpenScanItem,
        onOpen: onOpenScanItem,
        onClose: onCloseScanItem
    } = useDisclosure();




    return (
        <div className="col-12 d-flex pb-2 justify-content-end align-items-center ">

            <InputGroup size="sm"
                onClick={() => {
                    onOpenScanItem();
                }}
            >
                <InputLeftAddon>
                    <Button
                        size={"xs"}
                    >
                        <FaCamera />
                    </Button>
                </InputLeftAddon>
                <Input
                    borderRadius="0px"
                    placeholder="Input Bill Data"
                    value={selectedFile ? selectedFile.name : 'No file selected'}
                />


            </InputGroup>

            <Modal isOpen={isOpenScanItem}
                onClose={() => {
                    onCloseScanItem();
                }}
            >
                <ModalOverlay />
                <ModalContent maxW={"700px"}>
                    <ModalHeader> Scan Confirmation </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="container">
                            {/* <ImageUpload
                                text={text}
                                setText={setText}
                        /> */}
                            <OCRComponent
                                image={image}
                                setImage={setImage}
                                setOcrResult={setOcrResult}
                                ocrResult={ocrResult}
                                onCloseScanItem={onCloseScanItem}
                                selectedimage={selectedimage}
                                setSelectedImage={setSelectedImage}
                                setPrompt={setPrompt}
                                prompt={prompt}
                                loading={loading}
                                setLoading={setLoading}
                                setItems={setItems}
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                                transactionOrder={transactionOrder}
                                setTransactionOrder={setTransactionOrder}
                            />
                        </div>
                    </ModalBody>

                    {/* <ModalFooter>
                        <Button variant='solid' colorScheme="green"
                            onClick={() => {
                                handleTextRead();
                            }}

                        >
                            Scan
                        </Button>
                    </ModalFooter> */}
                </ModalContent>
            </Modal>


        </div >
    );
}

export default CardInput;
