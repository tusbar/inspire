import React from 'react'
import { get } from 'lodash'

import Chart from '../../../../components/Charts/Chart'
import DoughnutChart from '../../../../components/Charts/DoughnutChart/DoughnutChart'
import Counter from '../../../../components/Statistics/Counter/Counter'
import Percent from '../../../../components/Statistics/Percent/Percent'

import { container, section, chart } from './StatisticsSection.css'

const StatisticsSection = ({metrics}) => {
  const openness = get(metrics, 'datasets.partitions.openness.yes', 0)
  const download = get(metrics, 'datasets.partitions.download.yes', 0)

  return (
    <div className={container}>
      <h2>Indicateurs concernant la totalité du catalogue</h2>
      <div className={section}>

        <div className={chart}>
          <Counter size="large" value={metrics.records.totalCount} title="Enregistrements"/>
        </div>

        <div className={chart}>
          <Chart
            description={'Répartition des types d\'enregistrements'}
            chart={<DoughnutChart data={metrics.records.partitions.recordType} />} />
        </div>

        <div className={chart}>
          <Chart
            description={'Répartition des types de meta donnée'}
            chart={<DoughnutChart data={metrics.records.partitions.metadataType} />} />
        </div>
      </div>

      <h2>Indicateurs concernant les jeux de données</h2>
      <div className={section}>
        <div className={chart}>
          <Percent value={openness} total={metrics.datasets.totalCount} size="large" icon="unlock alternate icon" title="Pourcentage de données ouvertes" />
        </div>

        <div className={chart}>
          <Percent value={download} total={metrics.datasets.totalCount} size="large" icon="download" title="Pourcentage de jeu de données téléchargeable" />
        </div>

        <div className={chart}>
          <Chart
            description={'Répartition des types de donnée'}
            chart={<DoughnutChart data={metrics.datasets.partitions.dataType} />} />
        </div>
      </div>
    </div>
  )
}

export default StatisticsSection
