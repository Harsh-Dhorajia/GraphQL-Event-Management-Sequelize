const {
  validateEventInput,
  validateInviteInput,
} = require('../../utils/validators/eventValidator');
const { User, Event, Guest } = require('../../models');
const { pagination } = require('../../utils/pagination');

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

    async updateEvent(root, args, { user = null }) {
      const {
        eventName, date, description, eventId,
      } = args.input;
      const { isValid, error } = await validateEventInput(
        eventName,
        date,
        description,
      );
      if (!isValid || error) {
        throw new Error('Invalid Request Parameters');
      }
      try {
        const { id } = user;

        // get given event
        const event = await Event.findByPk(eventId);

        if (!event) {
          throw new Error('Event not found');
        }
        // verify the valid user to update the event
        if (event.userId !== id) {
          throw new Error('Only event creators are allow to update the event details');
        }
        await event.update({
          eventName,
          description,
          date,
        });
        return { message: 'Event updated successfully', event };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw new Error(err);
      }
    },

  },

  Query: {
    // eslint-disable-next-line no-unused-vars
    async getAllEvents(root, args, { user = null }) {
      const {
        limit, offset, order, searchOpt,
      } = pagination(args.input);

      const events = await Event.findAll({
        where: searchOpt,
        limit,
        offset,
        order,
      });
      return { events, message: 'All events fetch successfully' };
    },

    async getInvitedUsers(root, args, { user = null }) {
      try {
        const { id } = user;
        const { eventId } = args.input;
        const event = await Event.findOne({ where: { id: eventId, userId: id } });
        if (!event) {
          throw new Error('Event not found');
        }
        const guests = await Guest.findAll(
          {
            where: { eventId: event.id },
            include: [
              {
                model: User, as: 'user', attributes: ['username', 'email'],
              },
            ],
          },
        );

        return { message: 'Event details', guests };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw new Error(err);
      }
    },

    // eslint-disable-next-line no-unused-vars
    async getEventDetail(root, args, { user = null }) {
      try {
        // Get event detail with their invited users
        const event = await Event.findByPk(args.input.eventId, {
          include: [
            { model: User, as: 'user', attributes: ['username', 'email'] },
          ],
        });
        if (!event) throw new Error('Event not found');

        return { message: 'Event details', event };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        throw new Error(error);
      }
    },

    async getAllCreatedEvents(root, args, { user = null }) {
      try {
        const { id } = user;
        const eventOwner = await User.findByPk(id);

        const {
          limit, offset, order, searchOpt,
        } = pagination(args.input);

        const events = await eventOwner.getEvents({
          where: { ...searchOpt, userId: eventOwner.id },
          limit,
          offset,
          order,
        });
        return { events, message: 'User Events' };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        throw new Error(error);
      }
    },
  },
};
