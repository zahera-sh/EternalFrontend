import { useEffect, useState } from 'react'
import { getUsers, deleteUser, verifyUser } from '../services/adminService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'
import '../style/admin.css'

function Admin() {
    document.title = "Eternal | Admin"

    const navigate = useNavigate()
    const { user } = useAuth()
    const [users, setUsers] = useState([])

    async function loadUsers() {
        if (!user.role === 'Admin') {
            navigate('/items')
        }
        const getAllUsers = await getUsers()
        setUsers(getAllUsers.users)
    }
    useEffect(() => {
        loadUsers()
    }, [])

    async function deletedUser(userId) {
        try {
            const deletedUser = await deleteUser(userId)
            loadUsers()
        } catch (error) {
            console.log(err.response.data);
        }
    }

    async function verifiedUser(userId) {
        try {
            const verifiedUser = await verifyUser(userId)
            loadUsers()
        } catch (error) {
            console.log(err.response.data);
        }
    }
    return (
        <main className="admin-page">

            <div className="admin-header">
                <div>
                    <p className="headers">ETERNAL ADMINISTRATION</p>
                    <h1>Admin Dashboard</h1>
                    <p className="admin-subtitle">
                        Manage users and seller verification.
                    </p>
                </div>

                <div className="admin-count">
                    <span>USERS</span>
                    <strong>{users.length}</strong>
                </div>
            </div>


            <section className="admin-users">

                <div className="admin-users-header">
                    <span>User</span>
                    <span>Status</span>
                    <span>Seller Verification</span>
                    <span>Actions</span>
                </div>


                {users.length === 0 ? (

                    <div className="admin-empty">
                        <p>No Users</p>
                    </div>

                ) : (

                    users.map((oneUser) => (

                        <div
                            className="admin-user-row"
                            key={oneUser._id}
                        >

                            <div className="admin-user-info">
                                <span className="user-label">
                                    USER
                                </span>

                                <p>
                                    {oneUser.username}
                                </p>
                            </div>


                            <div className="admin-status">

                                {oneUser.isDeleted ? (
                                    <span className="status-badge deleted">
                                        Deleted User
                                    </span>
                                ) : (
                                    <span className="status-badge active">
                                        Active
                                    </span>
                                )}

                            </div>


                            <div className="admin-verification">

                                {oneUser.isDeleted ? (
                                    <span className="status-badge unavailable">
                                        —
                                    </span>
                                ) : oneUser.isVerifiedSeller ? (
                                    <span className="status-badge verified">
                                        Verified User
                                    </span>
                                ) : (
                                    <span className="status-badge pending">
                                        Not Verified
                                    </span>
                                )}

                            </div>


                            <div className="admin-actions">

                                {oneUser.isDeleted ? (

                                    <span className="no-action">
                                        No actions
                                    </span>

                                ) : (

                                    <>
                                        <button
                                            className="verify-button"
                                            onClick={() =>
                                                verifiedUser(
                                                    oneUser._id
                                                )
                                            }
                                            disabled={
                                                oneUser.isVerifiedSeller
                                            }
                                        >
                                            {oneUser.isVerifiedSeller
                                                ? "Verified"
                                                : "Verify User"}
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                deletedUser(
                                                    oneUser._id
                                                )
                                            }
                                        >
                                            Delete User
                                        </button>
                                    </>

                                )}

                            </div>

                        </div>

                    ))

                )}

            </section>

        </main>
    );
    // return (<>
    //     <h2>Admin</h2>
    //     <br />
    //     {users.length === 0 ? <p>No Users</p> :
    //         users.map((oneUser) =>
    //             <div key={oneUser._id}>
    //                 <p>{oneUser.username}</p>
    //                 {oneUser.isDeleted ? <p className='error'>Deleted User</p> : (<>
    //                     <button onClick={() => { deletedUser(oneUser._id) }}>Delete User</button>
    //                 </>)}

    //                 {oneUser.isDeleted ? null : (
    //                     oneUser.isVerifiedSeller ? (
    //                         <p className="error">Verified User</p>
    //                     ) : (
    //                         <button onClick={() => verifiedUser(oneUser._id)}>
    //                             Verify User
    //                         </button>
    //                     )
    //                 )}
    //                 <hr />
    //             </div>)}

    // </>)
}

export default Admin