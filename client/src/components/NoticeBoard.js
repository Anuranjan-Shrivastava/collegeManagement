import React, { Component } from 'react';

class NoticeBoard extends Component {
    render() {
        let content = this.props.post.text ;
        return (
            <div>
                {content}
            </div>
        );
    }
}

export default NoticeBoard;