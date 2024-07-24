import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,

} from '@chakra-ui/react';

import { RiLoginBoxFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";

import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    return (
        <div
            className="
            position-fixed top-0 start-0 
         vw-100 py-2 
        header
        "
        >

            <div className="row px-1 px-md-1">
                <div className="col-6 fw-bold  text-dark fs-3 pointer"

                >
                    <span onClick={() => navigate("/")}>
                        Bill-Scanner
                    </span>
                </div>
                <div className="col-6  d-flex justify-content-end">
                    <Menu>
                        <MenuButton
                            variant='outline'
                            className="btn btn-light"
                        >
                            <GiHamburgerMenu />
                        </MenuButton>
                        <MenuList>
                            <MenuItem
                                onClick={() => navigate("/transaction")}
                                icon={<RiLoginBoxFill />} >
                                Transaction
                            </MenuItem>
                            <MenuItem
                                onClick={() => navigate("/logbook")}
                                icon={<RiLoginBoxFill />} >
                                Log
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </div>
        </div >
    )
}

export default Header