const http = require('http')
const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors')
const app = new Koa();
const uuid = require('uuid')

let tickets = [{
		id: uuid.v4(),
		name: 'Поменять краску в принтере',
		description: 'Краска в хранилище',
		status: false,
		created: new Date()
	},
	{
		id: uuid.v4(),
		name: 'Купить хлеб',
		description: 'Деньги на полке',
		status: false,
		created: new Date()
	}
];
app.use(koaBody({
	urlencoded: true,
	multipart: true
}))
app.use(cors())

app.use(async ctx => {
	ctx.response.set('Access-Control-Allow-Origin', '*')
	ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
	const { method } = ctx.request.query;
	const req = ctx.request.query;

	switch (method) {
		case 'allTickets':
			const resp = []
			
			tickets.forEach(i => {
				resp.push({
					id: i.id,
					name: i.name,
        			status: i.status,
        			created: i.created
				})
			})
			ctx.response.body = resp;
			return;
		case 'ticketById':
			const res = tickets.filter(i => i.id === req.id);

			ctx.response.body = res;
			return;
		case 'createTicket':
			const ticket = ctx.request.body;
			ticket.id = uuid.v4();
			tickets.push(ticket);
			ctx.response.body = ticket;
			return;
		case 'deleteTicket':
			const newArr = tickets.filter(i => i.id !== req.id);
			tickets = newArr;
			ctx.response.body = tickets;
			return;
		case 'editTicket':
			const {
				id, name, description, status, created
			} = ctx.request.body;

			const ticketToEdit = tickets.find(i => i.id === req.id);
			ticketToEdit.id = req.id;
			ticketToEdit.name = name;
			ticketToEdit.description = description;
			ticketToEdit.status = status;
			ticketToEdit.created = created;

			ctx.response.body = ticketToEdit;
			return;
		default:
			ctx.response.status = 404;
			return;
	}
});

const server = http.createServer(app.callback())

const port = 3000;
server.listen(port, (err) => {
	if (err) {
		console.log(err)

		return
	}

	console.log('server is listening to ' + port)
})