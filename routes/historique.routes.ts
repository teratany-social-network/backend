import { Router } from "express"
import { addToHistoryController, getHistoriquesController, removeFromHistoriquesController } from "../controllers/historique.controller"
import { authenticateToken } from "../middleware/authentificationToken"
const HistoriqueRouter = Router()
HistoriqueRouter.post('/add', authenticateToken, (req, res) => addToHistoryController(req, res))
HistoriqueRouter.delete('/:id', authenticateToken, (req, res) => removeFromHistoriquesController(req, res))
HistoriqueRouter.get('/:id', authenticateToken, (req, res) => getHistoriquesController(req, res))

export { HistoriqueRouter }
