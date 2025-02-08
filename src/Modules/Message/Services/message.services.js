import { User, Message } from "../../../DB/models/index.js";

export const sendMessageServices = async (req, res) => {
    const { body, receiverId } = req.body;

    // check if the receiver exists
    const user = await User.findById(receiverId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // create the message
    const message = await Message.create({
        body,
        receiverId
    });
    res.status(201).json({ message: 'Message sent successfully', message });
}

// get all messages
export const getMessagesServices = async (req, res) => {
    const messages = await Message.find({}).populate(
        [
            {
                path: 'receiverId',
                select: 'username'
            }
        ]
    );

    res.status(200).json({ message: 'Messages retrieved successfully', messages });
}

export const getUserMessagesServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const messages = await Message.find({ receiverId: _id });
        res.status(200).json({ message: 'Messages retrieved successfully', data: messages });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}