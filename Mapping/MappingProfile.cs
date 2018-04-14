using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using vega.Controllers.Resources;
using vega.Core.Models;

namespace vega.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Domain to API Resource
            CreateMap<Make, MakeResource>();
            CreateMap<Model, KeyValuePairResource>();
            CreateMap<Feature, KeyValuePairResource>();
            CreateMap<Vehicle, SaveVehicleResource>()
                .ForMember(vr => vr.Contact, opt => opt.MapFrom(v => new ContactResource{ Name = v.ContactName, Email = v.ContactEmail, Phone = v.ContactPhone }))
                .ForMember(vr => vr.Features, opt => opt.MapFrom(v => v.Features.Select(f => f.FeatureId)));
            CreateMap<Vehicle, VehicleResource>()
                .ForMember(vr => vr.Contact, opt => opt.MapFrom(v => new ContactResource{ Name = v.ContactName, Email = v.ContactEmail, Phone = v.ContactPhone }))
                .ForMember(vr => vr.Features, opt => opt.MapFrom(v => v.Features.Select(f => f.Feature)))
                .ForMember(vr => vr.Make, opt => opt.MapFrom(v => v.Model.Make));
            CreateMap(typeof(QueryResult<>), typeof(QueryResultResource<>));
            CreateMap<Photo, PhotoResource>();

            // API resource to domain
            CreateMap<SaveVehicleResource, Vehicle>()
                .ForMember(v => v.Id, opt => opt.Ignore())
                .ForMember(v => v.ContactName, opt => opt.MapFrom(vr => vr.Contact.Name))
                .ForMember(v => v.ContactEmail, opt => opt.MapFrom(vr => vr.Contact.Email))
                .ForMember(v => v.ContactPhone, opt => opt.MapFrom(vr => vr.Contact.Phone))
                .ForMember(v => v.Features, opt => opt.Ignore())
                .AfterMap((vr, v) => {
                    // remove unselected features
                    var removedFeatures = v.Features.Where(f => !vr.Features.Contains(f.FeatureId));
                    foreach(var f in removedFeatures.ToList())
                        v.Features.Remove(f);
                    // add new features
                    var addedFeatures = vr.Features.Where( id => !v.Features.Any(f => f.FeatureId == id)).Select(id => new VehicleFeature{ FeatureId = id });
                    foreach(var f in addedFeatures.ToList())
                        v.Features.Add(f);
                });
            
            CreateMap<VehicleQueryResource, VehicleQuery>();
        }
    }
}