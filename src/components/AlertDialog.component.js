import * as AlertDialog from '@radix-ui/react-alert-dialog';

const CustomAlertDialog = ({ message, handleClick, positive, customSubmitBtn }) => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
                {
                    customSubmitBtn || <button style={{ width: "100px" }}>Submit</button>
                }
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="AlertDialogOverlay" />
                <AlertDialog.Content className="AlertDialogContent">
                    <AlertDialog.Title className="AlertDialogTitle">Are you absolutely sure?</AlertDialog.Title>
                    <br></br>
                    <AlertDialog.Description className="AlertDialogDescription">
                        {message}
                    </AlertDialog.Description>
                    {
                        positive ? (
                            <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
                                <AlertDialog.Action asChild>
                                    <button className="Button green"
                                        onClick={() => { handleClick() }}
                                    >Yes, confirm action</button>
                                </AlertDialog.Action>
                                <AlertDialog.Cancel asChild>
                                    <button className="Button mauve">Cancel</button>
                                </AlertDialog.Cancel>
                            </div>
                        ) : <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
                            <AlertDialog.Cancel asChild>
                                <button className="Button mauve">Cancel</button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button className="Button red" onClick={() => { handleClick() }}>Yes, confirm action</button>
                            </AlertDialog.Action>
                        </div>
                    }
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}

export default CustomAlertDialog;
