import { getSystem } from '../engine/systems'
import { useSettings } from '../settings/context'

/** Shows the active counting system's name in the table corner, mirroring the gear. */
export default function StrategyBadge() {
  const { systemId } = useSettings()
  return <div className="strategy-badge">{getSystem(systemId).name}</div>
}
