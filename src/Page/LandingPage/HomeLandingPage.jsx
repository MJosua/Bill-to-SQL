import { Button, Image, Input } from "@chakra-ui/react"
import Header from "../../Component/Base/Header"

function HomeLandingPage() {

    return (

        <div className="body px-md-5 ">


            <div className="container-fluid  position-relative">
                <div className="row vh-100 pt-4 position-relative d-flex justify-content-center align-items-center">
                    <Header />

                    <div className="position-absolute card w-25 h-25 bg-white kartu-kecil">
                        <div className="row">
                            <div className="col-12 fw-bold mt-3 mb-3">
                                Login
                            </div>
                            <div className="col-12 my-1">
                                <Input
                                    size="sm"
                                    placeholder="Username"

                                />
                            </div>
                            <div className="col-12 my-1">
                                <Input
                                    size="sm"
                                    placeholder="Password"
                                    type="password"
                                />
                            </div>
                            <div className="col-12 d-flex pt-2 justify-content-end">
                                <Button
                                    size="sm"
                                    colorScheme='teal'
                                    className="px-3 "
                                    onClick={() => handleLogin()}
                                >
                                    Submit
                                </Button>
                            </div>

                        </div>
                    </div>



                </div>
            </div>



        </div>

    )
}

export default HomeLandingPage