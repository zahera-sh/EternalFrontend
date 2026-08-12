import { useEffect, useState } from 'react'
import { getUsers, deleteUser, verifyUser } from '../services/adminService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'

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

    return (<>
        <h2>Admin</h2>
        <br />
        {users.length === 0 ? <p>No Users</p> :
            users.map((oneUser) =>
                <div key={oneUser._id}>
                    <p>{oneUser.username}</p>
                    {oneUser.isDeleted ? <p className='error'>Deleted User</p> : (<>
                        <button onClick={() => { deletedUser(oneUser._id) }}>Delete User</button>
                    </>)}

                    {oneUser.isDeleted ? null : (
                        oneUser.isVerifiedSeller ? (
                            <p className="error">Verified User</p>
                        ) : (
                            <button onClick={() => verifiedUser(oneUser._id)}>
                                Verify User
                            </button>
                        )
                    )}
                    <hr />
                </div>)}

    </>)
}

export default Admin