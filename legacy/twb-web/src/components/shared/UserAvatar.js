import Avatar from 'react-avatar';

export default function UserAvatar(props) {
    let avatar;
    if (props.photo) {
        if (props.photo.name) {
            avatar = <Avatar size={props.size} src={URL.createObjectURL(props.photo)} round={props.round} />
        } else {
            avatar = <Avatar size={props.size} src={props.photo} round={props.round} />
        }
    } else {
        avatar = <Avatar size={props.size} name={props.name} round={props.round} />
    }

    return avatar;
}