using AutoMapper;
using Investment.Application.DTOs.Request;
using Investment.Application.DTOs.Response;
using Investment.Domain.Entities;

namespace Investment.Application
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ================= USER MAPPINGS =================
            CreateMap<User, UserResponseDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            // Registration DTO (Password ko ignore karenge kyunki ise register service manually hash karegi)
            CreateMap<UserRequestDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

            // 🔥 NEW: Profile Update DTO Mapping Configuration
            // Isme password ka jhanjhat hi khatam, aur ID mapping route ke sath fully compile hogi
            CreateMap<UserUpdateRequestDto, User>();

            // ================= ASSET MAPPINGS =================
            CreateMap<Asset, AssetResponseDto>();
            CreateMap<AssetRequestDto, Asset>();

            // ================= PORTFOLIO MAPPINGS =================
            CreateMap<Portfolio, PortfolioResponseDto>();
            CreateMap<PortfolioRequestDto, Portfolio>();

            // ================= TRANSACTION MAPPINGS =================
            CreateMap<Transaction, TransactionResponseDto>()
                .ForMember(dest => dest.AssetName, opt => opt.MapFrom(src => src.Asset.AssetName));
            CreateMap<TransactionRequestDto, Transaction>();
        }
    }
}