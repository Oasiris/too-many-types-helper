import React from 'react'

import { useNavigate } from 'react-router'

const NotFound: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div id="notFound">
            <h3>Not Found</h3>
            <p>We couldn't find that page.</p>

            <button type="button" onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
    )
}

export default NotFound
