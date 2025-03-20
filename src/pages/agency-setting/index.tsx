import React from 'react'
import { records } from "../tables/data";
import { Link } from 'react-router-dom';
import { PageBreadcrumb } from '../../components';

const Agency = () => {
  return (
    <>
      <PageBreadcrumb title='Agency' name='Agency' breadCrumbItems={['Menu', 'Agency']} />

      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h4 className="card-title">List</h4>
          </div>
        </div>
        <div>
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                      <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(records || []).map((record, idx) => {
                      return (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{record.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{record.age}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{record.address}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            <Link className="text-primary hover:text-sky-700" to={{ pathname: `/agency/${record.id}` }}>Edit</Link>
                            <span> | </span>
                            <Link className="text-primary hover:text-sky-700" to="#">Delete</Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Agency