const {
  validateEventInput,
  validateInviteInput,
} = require('../../utils/validators/eventValidator');
const { User, Event, Guest } = require('../../models');

module.exports = {
  Mutation: {
    async createEvents(root, args, { user = null }) {
      const { eventName, date, description } = args.input;
      const { isValid, error } = await validateEventInput(
        eventName,
        date,
        description,
      );
      if (error || !isValid) {
        throw new Error('Invalid Request Parameters');
      }
      const { id } = user;
      const validUser = await User.findByPk(id);
      // using the mixin methods to create event
      const event = await validUser.createEvent({
        eventName,
        date,
        description,
        addedBy: validUser.username,
        userId: validUser.id,
      });

      return { event, message: 'Event created successfully' };
    },

    async inviteUser(root, args, { user = null }) {
      const { id } = user;
      const { email, eventId } = args.input;
      const { isValid, error } = await validateInviteInput(email);
      if (!isValid || error) {
        throw new Error('Invalid Request Parameters');
      }
      try {
        const owner = await User.findByPk(id);
        if (owner.email === email) {
          throw new Error('Email is same as your email. Please try another email');
        }
        const eventOwner = await User.findOne({ where: { email } });

        if (!eventOwner) {
          throw new Error('Please enter email who is registered user on event management');
        }
        const event = await Event.findByPk(eventId);
        if (!event) {
          throw new Error('Event not found');
        }

        if (id !== event.userId) {
          throw new Error('You are not allow to invite users');
        }
        const userAlreadyInvited = await Guest.findAll({
          where: {
            invitedBy: email,
            eventId,
          },
        });

        if (userAlreadyInvited.length >= 1) {
          throw new Error('This email is already invited');
        }
        await Guest.create({
          eventId,
          userId: user.id,
          invitedBy: email,
        });
        return { message: 'Invited Successfully' };
      } catch (err) {
        // eslint-disable-next-line no-console
        throw new Error(err);
      }
    },
  },
};
