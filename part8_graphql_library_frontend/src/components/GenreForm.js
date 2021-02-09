import React from "react";

const GenreForm = ({genres, onChange}) => {



    return (
        <div>
            <form>
                <select onChange={onChange}>
                    <option defaultValue={"all"}>all</option>
                    {
                        genres.map(g =>
                            <option
                                key={g}
                            >{g}</option>
                        )
                    }
                </select>
            </form>
        </div>
    )
}

export default GenreForm