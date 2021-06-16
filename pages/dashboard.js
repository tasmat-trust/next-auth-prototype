// pages/dashboard.js
import { getSession, signOut } from 'next-auth/client'

import axios from 'axios'
export default function Dashboard({ user, students }) {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome {user.email}</p>

            {students && students.map((each, index) => {
                return (
                    <div key={index}>
                        <h3>{each.Name}</h3>
                    </div>
                )
            })}


            <button onClick={() => signOut()}>Sign out</button>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx)
    if (!session) {
        ctx.res.writeHead(302, { Location: '/' })
        ctx.res.end()
        return {}
    }


    let headers = { Authorization: `Bearer ${session.jwt}` };
    console.log(headers)
    let students = [];
    try {
        let { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
            headers: headers,
        })
        students = data;
    } catch (e) {
        console.log(e)
        console.log('caught get error');
        students = [];
    }

    return {

        props: {
            user: session.user,
            students: students
        },
    }
}