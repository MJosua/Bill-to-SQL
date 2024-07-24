import { Input } from "@chakra-ui/react"
import Header from "../../Component/Base/Header"
import { Button } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
function LoginPage() {
    const navigate= useNavigate();
    const handleLogin = () => {
        navigate("/logbook")
    }
    return (
        <div className="body px-md-5 ">
            <div className="container-fluid position-relative">
                <div className="row vh-100 pt-4">
                    <Header />
                    <div className="col-12  pt-5 pb-5 h-100 d-flex justify-content-center align-items-center">
                        <div className="col-7 col-md-2">
                            <div className="kartu shadow py-2 px-3">
                                <div className="row">
                                    <div className="col-12 mb-2 fw-bold">
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
                                        onClick={()=>handleLogin()}
                                        >
                                            Submit
                                        </Button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>



        </div>
    )
}
export default LoginPage