
// Sources Section Component
export default function SourcesSection() {
  return (
    <section className="mt-8 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
      <details className="text-sm text-gray-400">
        <summary className="cursor-pointer hover:text-gray-300">Sources</summary>
      
      <div className="space-y-4 pl-2">
        <div>
          <h4 className="text-gray-300 mb-2">News Articles</h4>
          <ul className="space-y-1">
            <li>
              <a href="https://economictimes.indiatimes.com/news/india/air-pollution-every-day-464-children-in-india-die-report/articleshow/111133693.cms" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Air pollution: Every day, 464 children in India die: Report - Economic Times, 2024
              </a>
            </li>
            <li>
              <a href="https://www.bc.edu/bc-web/bcnews/nation-world-society/international/air-pollution-in-inda.html" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                The human toll of air pollution in India - Boston College News, 2021
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-300 mb-2">Research Studies</h4>
          <ul className="space-y-1">
            <li>
              <a href="https://www.pnas.org/doi/10.1073/pnas.1809474115"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Zhang et al. (2018). &quot;The impact of exposure to air pollution on cognitive performance.&quot; <i>PNAS</i>
              </a>
            </li>
            <li>Chen et al. (2013). &quot;Evidence on the impact of sustained exposure to air pollution on life expectancy.&quot; <i>PNAS</i></li>
            <li>WHO Global Air Quality Guidelines (2021)</li>
            <li>
              <a href="https://sph.emory.edu/news/news-release/2023/10/air-pollution-exposure-puberty.html"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Emory University (2023). &quot;Air Pollution Exposure During Childhood and Adolescence.&quot;
              </a>
            </li>
            <li>
              <a href="https://www.lung.org/clean-air/outdoors/who-is-at-risk"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                American Lung Association (2023). &quot;Who is at Risk from Air Pollution?&quot;
              </a>
            </li>
            <li>
              <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6904854/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Sahu et al. (2020). &quot;Air Pollution and Cardiovascular Disease: A Focus on Vulnerable Populations.&quot;
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-300 mb-2">Age-Specific Impact Studies</h4>
          <ul className="space-y-1">
            <li>
              <a href="https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(19)30090-1/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                The Lancet (2019). &quot;Age-specific effects of air pollution on cognitive performance.&quot;
              </a>
            </li>
            <li>
              <a href="https://www.nature.com/articles/s41598-019-44561-0"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Nature (2019). &quot;Differential susceptibility to air pollution by age group.&quot;
              </a>
            </li>
          </ul>
        </div>
      </div>
    </details>
  </section>
  );
}
