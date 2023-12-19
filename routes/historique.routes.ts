import { Router } from "express"
import { addTextToHistoriquesController, getHistoriquesController, removeFromHistoriquesController } from "../controllers/historique.controller"
import { authenticateToken } from "../middleware/authentificationToken"
const HistoriqueRouter = Router()
HistoriqueRouter.post('/add', authenticateToken, (req, res) => addTextToHistoriquesController(req, res))
HistoriqueRouter.delete('/:id', authenticateToken, (req, res) => removeFromHistoriquesController(req, res))
HistoriqueRouter.get('/:id', authenticateToken, (req, res) => getHistoriquesController(req, res))

export { HistoriqueRouter }
