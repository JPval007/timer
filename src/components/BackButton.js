

function BackButton(props) {

    return (
        <>
        <button {...props} className={'with-text'}>
            <i class="fa-solid fa-arrow-left"></i>
            Back
        </button>
        </>
    );
}

export default BackButton;