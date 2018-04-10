using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vega.Core;
using vega.Core.Models;
using vega.Extensions;

namespace vega.Persistence
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;
        public VehicleRepository(VegaDbContext context)
        {
            this.context = context;
        }

        public async Task<Vehicle> GetVehicle(int id, bool includeRelated = true)
        {
            if (!includeRelated)
                return await context.Vehicles.FindAsync(id);

            return await context.Vehicles.
                Include(v => v.Features).
                ThenInclude(vf => vf.Feature).
                Include(v => v.Model).
                ThenInclude(m => m.Make).
                SingleOrDefaultAsync(v => v.Id == id);
        }

        public void Add(Vehicle vehicle)
        {
            context.Vehicles.Add(vehicle);
        }

        public void Remove(Vehicle vehicle)
        {
            context.Vehicles.Remove(vehicle);
        }

        public async Task<QueryResult<Vehicle>> GetVehicles(VehicleQuery queryObj)
        {
            var queryResult = new QueryResult<Vehicle>();
            var query = context.Vehicles.
                Include(v => v.Features).
                ThenInclude(vf => vf.Feature).
                Include(v => v.Model).
                ThenInclude(m => m.Make)
                .AsQueryable();

            if(queryObj.MakeId.HasValue)
                query = query.Where(v => v.Model.MakeId == queryObj.MakeId);
            if(queryObj.ModelId.HasValue)
                query = query.Where(v => v.ModelId == queryObj.ModelId);

            var columnsMap = new Dictionary<string, Expression<Func<Vehicle, object>>> 
            {
                ["make"] = v => v.Model.Make.Name,
                ["model"] = v => v.Model.Name,
                ["contactName"] = v => v.ContactName
            };

            query = query.ApplyOrdering(queryObj, columnsMap);
            
            queryResult.TotalItems = await query.CountAsync();
            query = query.ApplyPaging(queryObj);
            queryResult.Items = await query.ToListAsync();

            return queryResult;
        }
    }
}